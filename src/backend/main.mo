import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Nat64 "mo:core/Nat64";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type TransactionType = {
    #income;
    #expense;
  };

  public type Category = {
    #food;
    #transport;
    #salary;
    #utilities;
    #entertainment;
    #other;
  };

  public type Transaction = {
    transactionId : Nat;
    amount : Nat64;
    date : Time.Time;
    transactionType : TransactionType;
    category : Category;
    description : Text;
  };

  public type TransactionData = {
    amount : Nat64;
    date : Time.Time;
    transactionType : TransactionType;
    category : Category;
    description : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextTransactionId = 0;

  let transactions = Map.empty<Principal, Map.Map<Nat, Transaction>>();
  let monthlySummaries = Map.empty<Principal, Map.Map<Nat, { income : Nat64; expense : Nat64 }>>();
  let categorySummaries = Map.empty<Principal, Map.Map<Category, Nat64>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addTransaction(data : TransactionData) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add transactions");
    };

    let transactionId = nextTransactionId;
    nextTransactionId += 1;

    let newTransaction : Transaction = {
      transactionId;
      amount = data.amount;
      date = data.date;
      transactionType = data.transactionType;
      category = data.category;
      description = data.description;
    };

    let userTransactions = switch (transactions.get(caller)) {
      case (null) {
        let newMap = Map.empty<Nat, Transaction>();
        transactions.add(caller, newMap);
        newMap;
      };
      case (?map) { map };
    };

    userTransactions.add(transactionId, newTransaction);

    transactions.add(caller, userTransactions);

    updateMonthlySummary(caller, data.date, data.amount, data.transactionType);
    updateCategorySummary(caller, data.category, data.amount);

    transactionId;
  };

  func updateMonthlySummary(_user : Principal, _date : Time.Time, _amount : Nat64, _transactionType : TransactionType) {
    // Placeholder for monthly summary logic
  };

  func updateCategorySummary(_user : Principal, _category : Category, _amount : Nat64) {
    // Placeholder for category summary logic
  };

  public shared ({ caller }) func updateTransaction(transactionId : Nat, data : TransactionData) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update transactions");
    };

    let userTransactions = switch (transactions.get(caller)) {
      case (null) { Runtime.trap("No transactions found for user") };
      case (?map) { map };
    };

    let existingTransaction = switch (userTransactions.get(transactionId)) {
      case (null) { Runtime.trap("Transaction not found") };
      case (?transaction) { transaction };
    };

    let updatedTransaction : Transaction = {
      transactionId;
      amount = data.amount;
      date = data.date;
      transactionType = data.transactionType;
      category = data.category;
      description = data.description;
    };

    userTransactions.add(transactionId, updatedTransaction);
    transactions.add(caller, userTransactions);
  };

  public shared ({ caller }) func deleteTransaction(transactionId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete transactions");
    };

    let userTransactions = switch (transactions.get(caller)) {
      case (null) { Runtime.trap("No transactions found for user") };
      case (?map) { map };
    };

    if (not userTransactions.containsKey(transactionId)) {
      Runtime.trap("Transaction not found");
    };

    userTransactions.remove(transactionId);
    transactions.add(caller, userTransactions);
  };

  public query ({ caller }) func getUserTransactions() : async [Transaction] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their transactions");
    };

    let userTransactions = switch (transactions.get(caller)) {
      case (null) { return [] };
      case (?map) { map };
    };

    userTransactions.values().toArray();
  };

  public query ({ caller }) func getTransactionsByType(transactionType : TransactionType) : async [Transaction] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their transactions");
    };

    let userTransactions = switch (transactions.get(caller)) {
      case (null) { return [] };
      case (?map) { map };
    };

    userTransactions.values().toArray().filter(
      func(t) { t.transactionType == transactionType }
    );
  };

  public query ({ caller }) func getTransactionsByCategory(category : Category) : async [Transaction] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their transactions");
    };

    let userTransactions = switch (transactions.get(caller)) {
      case (null) { return [] };
      case (?map) { map };
    };

    userTransactions.values().toArray().filter(
      func(t) { t.category == category }
    );
  };

  public query ({ caller }) func getTransactionsInDateRange(startDate : Time.Time, endDate : Time.Time) : async [Transaction] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their transactions");
    };

    let userTransactions = switch (transactions.get(caller)) {
      case (null) { return [] };
      case (?map) { map };
    };

    userTransactions.values().toArray().filter(
      func(t) { t.date >= startDate and t.date <= endDate }
    );
  };

  public query ({ caller }) func getTransaction(transactionId : Nat) : async Transaction {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their transactions");
    };

    let userTransactions = switch (transactions.get(caller)) {
      case (null) { Runtime.trap("Transaction not found") };
      case (?map) {
        switch (map.get(transactionId)) {
          case (null) { Runtime.trap("Transaction not found") };
          case (?transaction) { transaction };
        };
      };
    };
  };

  public type MonthlySummary = {
    month : Nat;
    year : Nat;
    income : Nat64;
    expenses : Nat64;
  };

  public query ({ caller }) func getMonthlyStats(month : Nat, year : Nat) : async MonthlySummary {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view stats");
    };

    calculateMonthlyValues(caller, month, year);
  };

  func calculateMonthlyValues(_user : Principal, _month : Nat, _year : Nat) : MonthlySummary {
    {
      month = 0;
      year = 0;
      income = 0;
      expenses = 0;
    };
  };

  public type CategoryBreakdown = {
    food : Nat64;
    transport : Nat64;
    salary : Nat64;
    utilities : Nat64;
    entertainment : Nat64;
    other : Nat64;
  };

  public query ({ caller }) func getCategoryStats(startDate : Time.Time, endDate : Time.Time) : async CategoryBreakdown {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view stats");
    };

    calculateCategoryStats(caller, startDate, endDate);
  };

  func calculateCategoryStats(_user : Principal, _startDate : Time.Time, _endDate : Time.Time) : CategoryBreakdown {
    {
      food = 0;
      transport = 0;
      salary = 0;
      utilities = 0;
      entertainment = 0;
      other = 0;
    };
  };

  func sortTransactions(_transactions : [Transaction]) : [Transaction] {
    _transactions;
  };

  public type Report = {
    monthlySummaries : [MonthlySummary];
    categoryBreakdowns : [CategoryBreakdown];
  };

  public query ({ caller }) func generateReport(_startDate : Time.Time, _endDate : Time.Time) : async Report {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can generate reports");
    };

    {
      monthlySummaries = [];
      categoryBreakdowns = [];
    };
  };

  public query ({ caller }) func exportTransactionsAsCsv(transactions : [Transaction]) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can export transactions as CSV");
    };

    let header = "Transaction ID,Amount,Date,Type,Category,Description\n";

    transactions.values().toArray().foldLeft(
      header,
      func(acc, t) {
        acc # formatTransactionAsCsvRow(t) # "\n";
      },
    );
  };

  func formatTransactionAsCsvRow(_transaction : Transaction) : Text {
    "";
  };
};
