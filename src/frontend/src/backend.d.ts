import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SuratKeteranganSehat {
    id: bigint;
    weight: bigint;
    height: bigint;
    doctorId: bigint;
    patientId: bigint;
    bloodPressure: string;
    issuedDate: Time;
    notes: string;
    pulse: bigint;
    purpose: string;
}
export type Time = bigint;
export interface LineItem {
    qty: bigint;
    date: Time;
    description: string;
    discount: bigint;
    category: string;
    basePrice: bigint;
    appliedCharge: bigint;
}
export interface SuratKeteranganSakit {
    id: bigint;
    doctorId: bigint;
    endDate: Time;
    patientId: bigint;
    diagnosis: string;
    issuedDate: Time;
    notes: string;
    restDays: bigint;
    startDate: Time;
}
export interface Doctor {
    id: bigint;
    name: string;
    specialization: string;
    phone: string;
}
export interface ServiceCatalog {
    id: bigint;
    name: string;
    category: string;
    basePrice: bigint;
}
export interface Invoice {
    id: bigint;
    status: string;
    lineItems: Array<LineItem>;
    patientId: bigint;
    dateOfPrinting: Time;
    payer?: string;
    registrationDate: Time;
    regNo: string;
}
export interface Patient {
    id: bigint;
    patientNo: string;
    dateOfBirth: Time;
    name: string;
    createdAt: Time;
    address: string;
    gender: Gender;
    phone: string;
}
export interface UserProfile {
    name: string;
    role: string;
}
export enum Gender {
    other = "other",
    female = "female",
    male = "male"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createDoctor(name: string, specialization: string, phone: string): Promise<void>;
    createHealthCertificate(patientId: bigint, doctorId: bigint, purpose: string, issuedDate: Time, notes: string, bloodPressure: string, pulse: bigint, weight: bigint, height: bigint): Promise<void>;
    createInvoice(patientId: bigint, registrationDate: Time, regNo: string, payer: string | null, dateOfPrinting: Time, status: string, lineItems: Array<LineItem>): Promise<void>;
    createPatient(name: string, dateOfBirth: Time, gender: Gender, address: string, phone: string): Promise<void>;
    createService(name: string, category: string, basePrice: bigint): Promise<void>;
    createSickNote(patientId: bigint, doctorId: bigint, diagnosis: string, startDate: Time, endDate: Time, restDays: bigint, issuedDate: Time, notes: string): Promise<void>;
    deleteDoctor(id: bigint): Promise<void>;
    deleteHealthCertificate(id: bigint): Promise<void>;
    deleteInvoice(id: bigint): Promise<void>;
    deletePatient(id: bigint): Promise<void>;
    deleteService(id: bigint): Promise<void>;
    deleteSickNote(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDoctors(): Promise<Array<Doctor>>;
    getHealthCertificates(): Promise<Array<SuratKeteranganSehat>>;
    getInvoices(): Promise<Array<Invoice>>;
    getPatients(): Promise<Array<Patient>>;
    getServices(): Promise<Array<ServiceCatalog>>;
    getSickNotes(): Promise<Array<SuratKeteranganSakit>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateDoctor(id: bigint, name: string, specialization: string, phone: string): Promise<void>;
    updatePatient(id: bigint, name: string, dateOfBirth: Time, gender: Gender, address: string, phone: string): Promise<void>;
    updateService(id: bigint, name: string, category: string, basePrice: bigint): Promise<void>;
}
