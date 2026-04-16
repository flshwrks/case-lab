"use client";

import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { SparringSession, StoredHistory } from "@/types";

const DB_NAME = "case-interview-db";
const DB_VERSION = 1;
const STORE_NAME = "sessions";
const MAX_SESSIONS = 50;

interface CaseInterviewDB extends DBSchema {
  sessions: {
    key: string;
    value: SparringSession;
    indexes: { "by-startedAt": number };
  };
}

let dbPromise: Promise<IDBPDatabase<CaseInterviewDB>> | null = null;

function getDB(): Promise<IDBPDatabase<CaseInterviewDB>> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB is not available on the server"));
  }
  if (!dbPromise) {
    dbPromise = openDB<CaseInterviewDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("by-startedAt", "startedAt");
      },
    }).catch((err) => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

export async function saveSession(session: SparringSession): Promise<void> {
  try {
    const db = await getDB();
    await db.put(STORE_NAME, session);

    // Trim to MAX_SESSIONS
    const allKeys = await db.getAllKeysFromIndex(STORE_NAME, "by-startedAt");
    if (allKeys.length > MAX_SESSIONS) {
      const toDelete = allKeys.slice(0, allKeys.length - MAX_SESSIONS);
      const tx = db.transaction(STORE_NAME, "readwrite");
      await Promise.all(toDelete.map((k) => tx.store.delete(k)));
      await tx.done;
    }
  } catch (err) {
    console.error("Failed to save session:", err);
  }
}

export async function loadHistory(): Promise<StoredHistory> {
  try {
    const db = await getDB();
    const sessions = await db.getAllFromIndex(
      STORE_NAME,
      "by-startedAt"
    );
    return {
      sessions: sessions.reverse(), // newest first
      version: DB_VERSION,
    };
  } catch (err) {
    console.error("Failed to load history:", err);
    return { sessions: [], version: DB_VERSION };
  }
}

export async function loadSession(id: string): Promise<SparringSession | undefined> {
  try {
    const db = await getDB();
    return db.get(STORE_NAME, id);
  } catch {
    return undefined;
  }
}

export async function deleteSession(id: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
  } catch (err) {
    console.error("Failed to delete session:", err);
  }
}

export async function clearHistory(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear(STORE_NAME);
  } catch (err) {
    console.error("Failed to clear history:", err);
  }
}
