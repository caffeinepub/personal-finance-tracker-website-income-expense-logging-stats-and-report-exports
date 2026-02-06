import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransactionData {
    transactionType: TransactionType;
    date: Time;
    description: string;
    category: Category;
    amount: bigint;
}
export interface CategoryBreakdown {
    salary: bigint;
    other: bigint;
    entertainment: bigint;
    food: bigint;
    transport: bigint;
    utilities: bigint;
}
export type Time = bigint;
export interface MonthlySummary {
    month: bigint;
    expenses: bigint;
    year: bigint;
    income: bigint;
}
export interface Report {
    categoryBreakdowns: Array<CategoryBreakdown>;
    monthlySummaries: Array<MonthlySummary>;
}
export interface UserProfile {
    name: string;
}
export interface Transaction {
    transactionType: TransactionType;
    date: Time;
    description: string;
    category: Category;
    amount: bigint;
    transactionId: bigint;
}
export enum Category {
    salary = "salary",
    other = "other",
    entertainment = "entertainment",
    food = "food",
    transport = "transport",
    utilities = "utilities"
}
export enum TransactionType {
    expense = "expense",
    income = "income"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTransaction(data: TransactionData): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteTransaction(transactionId: bigint): Promise<void>;
    exportTransactionsAsCsv(transactions: Array<Transaction>): Promise<string>;
    generateReport(_startDate: Time, _endDate: Time): Promise<Report>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategoryStats(startDate: Time, endDate: Time): Promise<CategoryBreakdown>;
    getMonthlyStats(month: bigint, year: bigint): Promise<MonthlySummary>;
    getTransaction(transactionId: bigint): Promise<Transaction>;
    getTransactionsByCategory(category: Category): Promise<Array<Transaction>>;
    getTransactionsByType(transactionType: TransactionType): Promise<Array<Transaction>>;
    getTransactionsInDateRange(startDate: Time, endDate: Time): Promise<Array<Transaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserTransactions(): Promise<Array<Transaction>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateTransaction(transactionId: bigint, data: TransactionData): Promise<void>;
}
