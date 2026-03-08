import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Module for Patient Type and Comparison
  module Patient {
    public type Gender = {
      #male;
      #female;
      #other;
    };

    public type Patient = {
      id : Nat;
      name : Text;
      patientNo : Text;
      dateOfBirth : Time.Time;
      gender : Gender;
      address : Text;
      phone : Text;
      createdAt : Time.Time;
    };

    public func compare(p1 : Patient, p2 : Patient) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  // Doctor Module
  module Doctor {
    public type Doctor = {
      id : Nat;
      name : Text;
      specialization : Text;
      phone : Text;
    };

    public func compare(d1 : Doctor, d2 : Doctor) : Order.Order {
      Nat.compare(d1.id, d2.id);
    };
  };

  // Service Catalog Module
  module ServiceCatalog {
    public type ServiceCatalog = {
      id : Nat;
      name : Text;
      category : Text;
      basePrice : Nat;
    };

    public func compare(s1 : ServiceCatalog, s2 : ServiceCatalog) : Order.Order {
      Nat.compare(s1.id, s2.id);
    };
  };

  // Invoice Module
  module Invoice {
    public type Invoice = {
      id : Nat;
      patientId : Nat;
      registrationDate : Time.Time;
      regNo : Text;
      payer : ?Text;
      dateOfPrinting : Time.Time;
      status : Text;
      lineItems : [LineItem];
    };

    public type LineItem = {
      date : Time.Time;
      category : Text;
      description : Text;
      basePrice : Nat;
      qty : Nat;
      discount : Nat;
      appliedCharge : Nat;
    };

    public func compare(i1 : Invoice, i2 : Invoice) : Order.Order {
      Nat.compare(i1.id, i2.id);
    };
  };

  // SuratKeteranganSakit Module
  module SuratKeteranganSakit {
    public type SuratKeteranganSakit = {
      id : Nat;
      patientId : Nat;
      doctorId : Nat;
      diagnosis : Text;
      startDate : Time.Time;
      endDate : Time.Time;
      restDays : Nat;
      issuedDate : Time.Time;
      notes : Text;
    };

    public func compare(s1 : SuratKeteranganSakit, s2 : SuratKeteranganSakit) : Order.Order {
      Nat.compare(s1.id, s2.id);
    };
  };

  // SuratKeteranganSehat Module
  module SuratKeteranganSehat {
    public type SuratKeteranganSehat = {
      id : Nat;
      patientId : Nat;
      doctorId : Nat;
      purpose : Text;
      issuedDate : Time.Time;
      notes : Text;
      bloodPressure : Text;
      pulse : Nat;
      weight : Nat;
      height : Nat;
    };

    public func compare(s1 : SuratKeteranganSehat, s2 : SuratKeteranganSehat) : Order.Order {
      Nat.compare(s1.id, s2.id);
    };
  };

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Gender = Patient.Gender;
  public type Patient = Patient.Patient;
  public type Doctor = Doctor.Doctor;
  public type ServiceCatalog = ServiceCatalog.ServiceCatalog;
  public type Invoice = Invoice.Invoice;
  public type LineItem = Invoice.LineItem;
  public type SuratKeteranganSakit = SuratKeteranganSakit.SuratKeteranganSakit;
  public type SuratKeteranganSehat = SuratKeteranganSehat.SuratKeteranganSehat;

  // User Profile Type
  public type UserProfile = {
    name : Text;
    role : Text;
  };

  // Storage for entities
  let patients = Map.empty<Nat, Patient>();
  let doctors = Map.empty<Nat, Doctor>();
  let services = Map.empty<Nat, ServiceCatalog>();
  let invoices = Map.empty<Nat, Invoice>();
  let sickNotes = Map.empty<Nat, SuratKeteranganSakit>();
  let healthCertificates = Map.empty<Nat, SuratKeteranganSehat>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextId = 1;

  // Generate unique ID
  func generateId() : Nat {
    let id = nextId;
    nextId += 1;
    id;
  };

  // User Profile Management
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

  // Patient Records
  public shared ({ caller }) func createPatient(name : Text, dateOfBirth : Time.Time, gender : Gender, address : Text, phone : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create patients");
    };
    let id = generateId();
    let patient : Patient = {
      id;
      name;
      patientNo = "26" # id.toText();
      dateOfBirth;
      gender;
      address;
      phone;
      createdAt = Time.now();
    };
    patients.add(id, patient);
  };

  public query ({ caller }) func getPatients() : async [Patient] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view patients");
    };
    let patientsArray = patients.values().toArray();
    patientsArray.sort();
  };

  public shared ({ caller }) func updatePatient(id : Nat, name : Text, dateOfBirth : Time.Time, gender : Gender, address : Text, phone : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update patients");
    };
    switch (patients.get(id)) {
      case null {
        Runtime.trap("Patient not found");
      };
      case (?existingPatient) {
        let patient : Patient = {
          id;
          name;
          patientNo = existingPatient.patientNo;
          dateOfBirth;
          gender;
          address;
          phone;
          createdAt = existingPatient.createdAt;
        };
        patients.add(id, patient);
      };
    };
  };

  public shared ({ caller }) func deletePatient(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete patients");
    };
    patients.remove(id);
  };

  // Doctor Records
  public shared ({ caller }) func createDoctor(name : Text, specialization : Text, phone : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create doctors");
    };
    let id = generateId();
    let doctor : Doctor = {
      id;
      name;
      specialization;
      phone;
    };
    doctors.add(id, doctor);
  };

  public query ({ caller }) func getDoctors() : async [Doctor] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view doctors");
    };
    let doctorsArray = doctors.values().toArray();
    doctorsArray.sort();
  };

  public shared ({ caller }) func updateDoctor(id : Nat, name : Text, specialization : Text, phone : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update doctors");
    };
    let doctor : Doctor = {
      id;
      name;
      specialization;
      phone;
    };
    doctors.add(id, doctor);
  };

  public shared ({ caller }) func deleteDoctor(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete doctors");
    };
    doctors.remove(id);
  };

  // Service Catalog Records
  public shared ({ caller }) func createService(name : Text, category : Text, basePrice : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create services");
    };
    let id = generateId();
    let service : ServiceCatalog = {
      id;
      name;
      category;
      basePrice;
    };
    services.add(id, service);
  };

  public query ({ caller }) func getServices() : async [ServiceCatalog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view services");
    };
    let servicesArray = services.values().toArray();
    servicesArray.sort();
  };

  public shared ({ caller }) func updateService(id : Nat, name : Text, category : Text, basePrice : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update services");
    };
    let service : ServiceCatalog = {
      id;
      name;
      category;
      basePrice;
    };
    services.add(id, service);
  };

  public shared ({ caller }) func deleteService(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete services");
    };
    services.remove(id);
  };

  // Invoice Records
  public shared ({ caller }) func createInvoice(patientId : Nat, registrationDate : Time.Time, regNo : Text, payer : ?Text, dateOfPrinting : Time.Time, status : Text, lineItems : [LineItem]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create invoices");
    };
    let id = generateId();
    let invoice : Invoice = {
      id;
      patientId;
      registrationDate;
      regNo;
      payer;
      dateOfPrinting;
      status;
      lineItems;
    };
    invoices.add(id, invoice);
  };

  public query ({ caller }) func getInvoices() : async [Invoice] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view invoices");
    };
    let invoicesArray = invoices.values().toArray();
    invoicesArray.sort();
  };

  public shared ({ caller }) func deleteInvoice(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete invoices");
    };
    invoices.remove(id);
  };

  // Sick Leave Letter Records
  public shared ({ caller }) func createSickNote(patientId : Nat, doctorId : Nat, diagnosis : Text, startDate : Time.Time, endDate : Time.Time, restDays : Nat, issuedDate : Time.Time, notes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create sick notes");
    };
    let id = generateId();
    let sickNote : SuratKeteranganSakit = {
      id;
      patientId;
      doctorId;
      diagnosis;
      startDate;
      endDate;
      restDays;
      issuedDate;
      notes;
    };
    sickNotes.add(id, sickNote);
  };

  public query ({ caller }) func getSickNotes() : async [SuratKeteranganSakit] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sick notes");
    };
    let sickNotesArray = sickNotes.values().toArray();
    sickNotesArray.sort();
  };

  public shared ({ caller }) func deleteSickNote(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete sick notes");
    };
    sickNotes.remove(id);
  };

  // Health Certificate Records
  public shared ({ caller }) func createHealthCertificate(patientId : Nat, doctorId : Nat, purpose : Text, issuedDate : Time.Time, notes : Text, bloodPressure : Text, pulse : Nat, weight : Nat, height : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create health certificates");
    };
    let id = generateId();
    let healthCertificate : SuratKeteranganSehat = {
      id;
      patientId;
      doctorId;
      purpose;
      issuedDate;
      notes;
      bloodPressure;
      pulse;
      weight;
      height;
    };
    healthCertificates.add(id, healthCertificate);
  };

  public query ({ caller }) func getHealthCertificates() : async [SuratKeteranganSehat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view health certificates");
    };
    let healthCertificatesArray = healthCertificates.values().toArray();
    healthCertificatesArray.sort();
  };

  public shared ({ caller }) func deleteHealthCertificate(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete health certificates");
    };
    healthCertificates.remove(id);
  };
};
