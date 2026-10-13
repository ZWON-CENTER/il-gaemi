import { XMLParser, XMLValidator } from "fast-xml-parser";
import { Temporal } from "@js-temporal/polyfill";
import type { Holiday } from "../types";

const API_ENDPOINT =
  "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo";
const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_TIMER_MS = 2_147_483_647;
const MAX_XML_BYTES = 1_048_576;
const PAGE_SIZE = 100;
const MAX_PAGES = 100;

const errorMessages: Record<HolidayApiErrorCode, string> = {
  INVALID_ARGUMENT: "공휴일 조회 인자가 올바르지 않습니다.",
  NETWORK_ERROR: "공휴일 API에 연결할 수 없습니다.",
  TIMEOUT: "공휴일 API 요청 시간이 초과되었습니다.",
  ABORTED: "공휴일 API 요청이 취소되었습니다.",
  HTTP_ERROR: "공휴일 API가 HTTP 오류를 반환했습니다.",
  UPSTREAM_ERROR: "공휴일 API가 요청을 처리하지 못했습니다.",
  INVALID_RESPONSE: "공휴일 API 응답 형식이 올바르지 않습니다.",
  NO_DATA: "요청한 연도의 공휴일 데이터가 없습니다.",
};

export type HolidayApiErrorCode =
  | "INVALID_ARGUMENT"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "ABORTED"
  | "HTTP_ERROR"
  | "UPSTREAM_ERROR"
  | "INVALID_RESPONSE"
  | "NO_DATA";

export class HolidayApiError extends Error {
  readonly code: HolidayApiErrorCode;
  readonly status?: number;
  readonly upstreamCode?: string;

  constructor(
    code: HolidayApiErrorCode,
    details?: { status?: number; upstreamCode?: string },
  ) {
    super(errorMessages[code]);
    this.name = "HolidayApiError";
    this.code = code;

    if (details?.status !== undefined) this.status = details.status;
    if (
      details?.upstreamCode &&
      /^[A-Za-z0-9_-]{1,64}$/.test(details.upstreamCode)
    ) {
      this.upstreamCode = details.upstreamCode;
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface FetchKoreanHolidaysOptions {
  year: number;
  serviceKey: string;
  timeoutMs?: number;
  signal?: AbortSignal;
}

interface ParsedHolidayPage {
  totalCount: number;
  pageNo: number;
  numOfRows: number;
  items: unknown[];
}

const xmlParser = new XMLParser({
  ignoreAttributes: true,
  parseTagValue: false,
  trimValues: true,
  processEntities: false,
  htmlEntities: false,
  cdataPropName: "#cdata",
});

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function readInteger(
  value: unknown,
  field: string,
  minimum: number,
): number {
  const text = typeof value === "string" ? value.trim() : String(value);
  if (!/^(0|[1-9]\d*)$/.test(text)) {
    throw new HolidayApiError("INVALID_RESPONSE");
  }

  const number = Number(text);
  if (!Number.isSafeInteger(number) || number < minimum) {
    throw new HolidayApiError("INVALID_RESPONSE");
  }

  return number;
}

function parseHolidayPage(xml: string, expectedPageNo: number): ParsedHolidayPage {
  if (/<!\s*(?:DOCTYPE|ENTITY)\b/i.test(xml)) {
    throw new HolidayApiError("INVALID_RESPONSE");
  }

  let isValidXml: unknown;
  try {
    isValidXml = XMLValidator.validate(xml);
  } catch {
    throw new HolidayApiError("INVALID_RESPONSE");
  }
  if (isValidXml !== true) throw new HolidayApiError("INVALID_RESPONSE");

  let document: unknown;
  try {
    document = xmlParser.parse(xml);
  } catch {
    throw new HolidayApiError("INVALID_RESPONSE");
  }

  const root = asRecord(document);
  const gateway = asRecord(root?.OpenAPI_ServiceResponse);
  if (gateway) {
    const gatewayHeader = asRecord(gateway.cmmMsgHeader);
    throw new HolidayApiError("UPSTREAM_ERROR", {
      upstreamCode: String(gatewayHeader?.returnReasonCode ?? "GATEWAY_ERROR").trim(),
    });
  }

  const response = asRecord(root?.response);
  const header = asRecord(response?.header);
  if (!header || typeof header.resultCode !== "string") {
    throw new HolidayApiError("INVALID_RESPONSE");
  }

  const resultCode = header.resultCode.trim();
  if (resultCode !== "00") {
    throw new HolidayApiError("UPSTREAM_ERROR", {
      upstreamCode: resultCode,
    });
  }

  const body = asRecord(response?.body);
  if (!body) throw new HolidayApiError("INVALID_RESPONSE");

  const totalCount = readInteger(body.totalCount, "totalCount", 0);
  const pageNo = readInteger(body.pageNo, "pageNo", 1);
  const numOfRows = readInteger(body.numOfRows, "numOfRows", 1);
  if (pageNo !== expectedPageNo || numOfRows !== PAGE_SIZE) {
    throw new HolidayApiError("INVALID_RESPONSE");
  }

  const items = asRecord(body.items);
  const rawItems = items?.item;
  const rows =
    rawItems === undefined ? [] : Array.isArray(rawItems) ? rawItems : [rawItems];

  if (
    (totalCount === 0 && rows.length !== 0) ||
    (totalCount > 0 &&
      rows.length !== Math.min(PAGE_SIZE, totalCount - (pageNo - 1) * PAGE_SIZE))
  ) {
    throw new HolidayApiError("INVALID_RESPONSE");
  }

  return { totalCount, pageNo, numOfRows, items: rows };
}

function decodeXmlText(value: string): string {
  if (value.length > 512) throw new HolidayApiError("INVALID_RESPONSE");

  let decoded = "";
  let cursor = 0;
  while (cursor < value.length) {
    const ampersand = value.indexOf("&", cursor);
    if (ampersand === -1) return decoded + value.slice(cursor);

    decoded += value.slice(cursor, ampersand);
    const semicolon = value.indexOf(";", ampersand + 1);
    const nextAmpersand = value.indexOf("&", ampersand + 1);
    if (semicolon === -1 || (nextAmpersand !== -1 && nextAmpersand < semicolon)) {
      throw new HolidayApiError("INVALID_RESPONSE");
    }

    const entity = value.slice(ampersand + 1, semicolon);
    let replacement: string;
    switch (entity) {
      case "amp":
        replacement = "&";
        break;
      case "lt":
        replacement = "<";
        break;
      case "gt":
        replacement = ">";
        break;
      case "quot":
        replacement = '"';
        break;
      case "apos":
        replacement = "'";
        break;
      default: {
        let codePoint: number;
        if (/^#x[0-9A-Fa-f]+$/.test(entity)) {
          codePoint = Number.parseInt(entity.slice(2), 16);
        } else if (/^#[0-9]+$/.test(entity)) {
          codePoint = Number.parseInt(entity.slice(1), 10);
        } else {
          throw new HolidayApiError("INVALID_RESPONSE");
        }

        const isXmlCharacter =
          codePoint === 0x9 ||
          codePoint === 0xa ||
          codePoint === 0xd ||
          (codePoint >= 0x20 && codePoint <= 0xd7ff) ||
          (codePoint >= 0xe000 && codePoint <= 0xfffd) ||
          (codePoint >= 0x10000 && codePoint <= 0x10ffff);
        if (!isXmlCharacter) throw new HolidayApiError("INVALID_RESPONSE");
        replacement = String.fromCodePoint(codePoint);
      }
    }

    decoded += replacement;
    cursor = semicolon + 1;
  }

  return decoded;
}

function readHolidayName(value: unknown): string {
  if (typeof value === "string") return decodeXmlText(value).trim();

  const cdataNode = asRecord(value);
  if (!cdataNode || Object.keys(cdataNode).length !== 1 || !("#cdata" in cdataNode)) {
    throw new HolidayApiError("INVALID_RESPONSE");
  }

  const cdata = cdataNode["#cdata"];
  const nodes = Array.isArray(cdata) ? cdata : [cdata];
  let name = "";
  for (const node of nodes) {
    const text = asRecord(node)?.["#text"];
    if (typeof text !== "string") throw new HolidayApiError("INVALID_RESPONSE");
    name += text;
  }
  return name.trim();
}

function toHoliday(value: unknown, year: number): Holiday | null {
  const item = asRecord(value);
  if (!item) throw new HolidayApiError("INVALID_RESPONSE");

  if (typeof item.isHoliday !== "string" || typeof item.locdate !== "string") {
    throw new HolidayApiError("INVALID_RESPONSE");
  }

  const isHoliday = item.isHoliday.trim();
  const name = readHolidayName(item.dateName);
  const locdate = item.locdate.trim();

  if ((isHoliday !== "Y" && isHoliday !== "N") || !name || !/^\d{8}$/.test(locdate)) {
    throw new HolidayApiError("INVALID_RESPONSE");
  }

  const isoDate =
    locdate.slice(0, 4) +
    "-" +
    locdate.slice(4, 6) +
    "-" +
    locdate.slice(6, 8);

  let date: Temporal.PlainDate;
  try {
    date = Temporal.PlainDate.from(isoDate);
  } catch {
    throw new HolidayApiError("INVALID_RESPONSE");
  }

  if (date.year !== year || date.toString() !== isoDate) {
    throw new HolidayApiError("INVALID_RESPONSE");
  }

  return isHoliday === "Y" ? { date: isoDate, name, recurring: false } : null;
}

async function readXmlResponse(
  response: Response,
  timeoutController: AbortController,
  callerSignal?: AbortSignal,
): Promise<string> {
  if (!response.body) throw new HolidayApiError("INVALID_RESPONSE");

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let byteCount = 0;
  let xml = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      byteCount += value.byteLength;
      if (byteCount > MAX_XML_BYTES) {
        void reader.cancel().catch(() => undefined);
        throw new HolidayApiError("INVALID_RESPONSE");
      }

      try {
        xml += decoder.decode(value, { stream: true });
      } catch {
        throw new HolidayApiError("INVALID_RESPONSE");
      }
    }

    try {
      xml += decoder.decode();
    } catch {
      throw new HolidayApiError("INVALID_RESPONSE");
    }

    return xml;
  } catch (error) {
    void reader.cancel().catch(() => undefined);
    if (error instanceof HolidayApiError) throw error;
    if (callerSignal?.aborted) throw new HolidayApiError("ABORTED");
    if (timeoutController.signal.aborted) throw new HolidayApiError("TIMEOUT");
    throw new HolidayApiError("NETWORK_ERROR");
  } finally {
    reader.releaseLock();
  }
}

export async function fetchKoreanHolidays({
  year,
  serviceKey,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  signal,
}: FetchKoreanHolidaysOptions): Promise<Holiday[]> {
  if (
    !Number.isInteger(year) ||
    year < 1 ||
    year > 9999 ||
    typeof serviceKey !== "string" ||
    serviceKey.trim().length === 0 ||
    !Number.isSafeInteger(timeoutMs) ||
    timeoutMs < 1 ||
    timeoutMs > MAX_TIMER_MS
  ) {
    throw new HolidayApiError("INVALID_ARGUMENT");
  }
  if (signal?.aborted) throw new HolidayApiError("ABORTED");

  const controller = new AbortController();
  const abortFromCaller = () => controller.abort();
  signal?.addEventListener("abort", abortFromCaller, { once: true });
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const holidays: Holiday[] = [];
    let pageNo = 1;
    let expectedTotalCount: number | undefined;
    let receivedRowCount = 0;
    const seenRowsFromEarlierPages = new Set<string>();

    while (pageNo <= MAX_PAGES) {
      const url = new URL(API_ENDPOINT);
      url.searchParams.set("ServiceKey", serviceKey);
      url.searchParams.set("solYear", String(year).padStart(4, "0"));
      url.searchParams.set("numOfRows", String(PAGE_SIZE));
      url.searchParams.set("pageNo", String(pageNo));

      let response: Response;
      try {
        response = await fetch(url, {
          headers: { Accept: "application/xml" },
          redirect: "error",
          signal: controller.signal,
        });
      } catch {
        if (signal?.aborted) throw new HolidayApiError("ABORTED");
        if (controller.signal.aborted) throw new HolidayApiError("TIMEOUT");
        throw new HolidayApiError("NETWORK_ERROR");
      }

      if (!response.ok) {
        if (response.body) void response.body.cancel().catch(() => undefined);
        throw new HolidayApiError("HTTP_ERROR", { status: response.status });
      }

      const xml = await readXmlResponse(response, controller, signal);
      const page = parseHolidayPage(xml, pageNo);

      if (expectedTotalCount === undefined) {
        expectedTotalCount = page.totalCount;
      } else if (page.totalCount !== expectedTotalCount) {
        throw new HolidayApiError("INVALID_RESPONSE");
      }

      if (page.totalCount === 0) {
        throw new HolidayApiError("NO_DATA");
      }

      const pageRowKeys = page.items.map((item) => {
        const row = asRecord(item);
        if (!row) throw new HolidayApiError("INVALID_RESPONSE");
        return JSON.stringify([
          row.dateKind ?? null,
          row.seq ?? null,
          row.locdate ?? null,
          row.dateName ?? null,
          row.isHoliday ?? null,
        ]);
      });
      if (pageRowKeys.some((key) => seenRowsFromEarlierPages.has(key))) {
        throw new HolidayApiError("INVALID_RESPONSE");
      }
      for (const key of pageRowKeys) seenRowsFromEarlierPages.add(key);

      for (const item of page.items) {
        const holiday = toHoliday(item, year);
        receivedRowCount += 1;
        if (holiday) holidays.push(holiday);
      }

      if (receivedRowCount === page.totalCount) break;
      if (receivedRowCount > page.totalCount) {
        throw new HolidayApiError("INVALID_RESPONSE");
      }

      pageNo += 1;
    }

    if (
      expectedTotalCount === undefined ||
      pageNo > MAX_PAGES ||
      receivedRowCount !== expectedTotalCount ||
      holidays.length === 0
    ) {
      throw new HolidayApiError(
        holidays.length === 0 ? "NO_DATA" : "INVALID_RESPONSE",
      );
    }

    const unique = new Map<string, Holiday>();
    for (const holiday of holidays) {
      unique.set(holiday.date + "\u0000" + holiday.name, holiday);
    }

    return [...unique.values()].sort((a, b) =>
      a.date === b.date
        ? a.name < b.name
          ? -1
          : a.name > b.name
            ? 1
            : 0
        : a.date < b.date
          ? -1
          : 1,
    );
  } catch (error) {
    if (error instanceof HolidayApiError) throw error;
    if (signal?.aborted) throw new HolidayApiError("ABORTED");
    if (controller.signal.aborted) throw new HolidayApiError("TIMEOUT");
    throw new HolidayApiError("NETWORK_ERROR");
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abortFromCaller);
  }
}
