/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as accounts from "../accounts.js";
import type * as admin from "../admin.js";
import type * as adminDashboard from "../adminDashboard.js";
import type * as adminDashboardPublic from "../adminDashboardPublic.js";
import type * as catalog from "../catalog.js";
import type * as clients from "../clients.js";
import type * as dian from "../dian.js";
import type * as dianEmissionLogs from "../dianEmissionLogs.js";
import type * as documentPreferences from "../documentPreferences.js";
import type * as email_index from "../email/index.js";
import type * as email_logs from "../email/logs.js";
import type * as email_mutations from "../email/mutations.js";
import type * as email_queries from "../email/queries.js";
import type * as email_quota from "../email/quota.js";
import type * as email_send from "../email/send.js";
import type * as email_template from "../email/template.js";
import type * as email_types from "../email/types.js";
import type * as email_webhook from "../email/webhook.js";
import type * as folioAllocations from "../folioAllocations.js";
import type * as folioOfferings from "../folioOfferings.js";
import type * as folioPackages from "../folioPackages.js";
import type * as folioTransactions from "../folioTransactions.js";
import type * as http from "../http.js";
import type * as invoices from "../invoices.js";
import type * as lib_auth from "../lib/auth.js";
import type * as migrations_migrateProviderAccounts from "../migrations/migrateProviderAccounts.js";
import type * as migrations_migrateToFolioAllocations from "../migrations/migrateToFolioAllocations.js";
import type * as organizations from "../organizations.js";
import type * as paymentSources from "../paymentSources.js";
import type * as plans from "../plans.js";
import type * as resolutions from "../resolutions.js";
import type * as seed from "../seed.js";
import type * as subscriptions from "../subscriptions.js";
import type * as testing from "../testing.js";
import type * as transactions from "../transactions.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";
import type * as wompi from "../wompi.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  accounts: typeof accounts;
  admin: typeof admin;
  adminDashboard: typeof adminDashboard;
  adminDashboardPublic: typeof adminDashboardPublic;
  catalog: typeof catalog;
  clients: typeof clients;
  dian: typeof dian;
  dianEmissionLogs: typeof dianEmissionLogs;
  documentPreferences: typeof documentPreferences;
  "email/index": typeof email_index;
  "email/logs": typeof email_logs;
  "email/mutations": typeof email_mutations;
  "email/queries": typeof email_queries;
  "email/quota": typeof email_quota;
  "email/send": typeof email_send;
  "email/template": typeof email_template;
  "email/types": typeof email_types;
  "email/webhook": typeof email_webhook;
  folioAllocations: typeof folioAllocations;
  folioOfferings: typeof folioOfferings;
  folioPackages: typeof folioPackages;
  folioTransactions: typeof folioTransactions;
  http: typeof http;
  invoices: typeof invoices;
  "lib/auth": typeof lib_auth;
  "migrations/migrateProviderAccounts": typeof migrations_migrateProviderAccounts;
  "migrations/migrateToFolioAllocations": typeof migrations_migrateToFolioAllocations;
  organizations: typeof organizations;
  paymentSources: typeof paymentSources;
  plans: typeof plans;
  resolutions: typeof resolutions;
  seed: typeof seed;
  subscriptions: typeof subscriptions;
  testing: typeof testing;
  transactions: typeof transactions;
  users: typeof users;
  utils: typeof utils;
  wompi: typeof wompi;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
