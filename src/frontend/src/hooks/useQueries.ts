import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Doctor,
  Invoice,
  LineItem,
  Patient,
  ServiceCatalog,
  SuratKeteranganSakit,
  SuratKeteranganSehat,
  UserRole,
} from "../backend.d";
import { useActor } from "./useActor";

// ── Patients ────────────────────────────────────────────────────
export function useGetPatients() {
  const { actor, isFetching } = useActor();
  return useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPatients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePatient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      dateOfBirth: bigint;
      gender: import("../backend.d").Gender;
      address: string;
      phone: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createPatient(
        data.name,
        data.dateOfBirth,
        data.gender,
        data.address,
        data.phone,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });
}

export function useUpdatePatient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      dateOfBirth: bigint;
      gender: import("../backend.d").Gender;
      address: string;
      phone: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updatePatient(
        data.id,
        data.name,
        data.dateOfBirth,
        data.gender,
        data.address,
        data.phone,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });
}

export function useDeletePatient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deletePatient(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });
}

// ── Doctors ─────────────────────────────────────────────────────
export function useGetDoctors() {
  const { actor, isFetching } = useActor();
  return useQuery<Doctor[]>({
    queryKey: ["doctors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDoctors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateDoctor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      specialization: string;
      phone: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createDoctor(data.name, data.specialization, data.phone);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctors"] }),
  });
}

export function useUpdateDoctor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      specialization: string;
      phone: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateDoctor(
        data.id,
        data.name,
        data.specialization,
        data.phone,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctors"] }),
  });
}

export function useDeleteDoctor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteDoctor(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctors"] }),
  });
}

// ── Services ────────────────────────────────────────────────────
export function useGetServices() {
  const { actor, isFetching } = useActor();
  return useQuery<ServiceCatalog[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      category: string;
      basePrice: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createService(data.name, data.category, data.basePrice);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useUpdateService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      category: string;
      basePrice: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateService(
        data.id,
        data.name,
        data.category,
        data.basePrice,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useDeleteService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteService(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  });
}

// ── Invoices ────────────────────────────────────────────────────
export function useGetInvoices() {
  const { actor, isFetching } = useActor();
  return useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInvoices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateInvoice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      patientId: bigint;
      registrationDate: bigint;
      regNo: string;
      payer: string | null;
      dateOfPrinting: bigint;
      status: string;
      lineItems: LineItem[];
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createInvoice(
        data.patientId,
        data.registrationDate,
        data.regNo,
        data.payer,
        data.dateOfPrinting,
        data.status,
        data.lineItems,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] }),
  });
}

export function useDeleteInvoice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteInvoice(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] }),
  });
}

// ── Sick Notes ──────────────────────────────────────────────────
export function useGetSickNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<SuratKeteranganSakit[]>({
    queryKey: ["sickNotes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSickNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSickNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      patientId: bigint;
      doctorId: bigint;
      diagnosis: string;
      startDate: bigint;
      endDate: bigint;
      restDays: bigint;
      issuedDate: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createSickNote(
        data.patientId,
        data.doctorId,
        data.diagnosis,
        data.startDate,
        data.endDate,
        data.restDays,
        data.issuedDate,
        data.notes,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sickNotes"] }),
  });
}

export function useDeleteSickNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteSickNote(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sickNotes"] }),
  });
}

// ── Health Certificates ──────────────────────────────────────────
export function useGetHealthCertificates() {
  const { actor, isFetching } = useActor();
  return useQuery<SuratKeteranganSehat[]>({
    queryKey: ["healthCertificates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHealthCertificates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateHealthCertificate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      patientId: bigint;
      doctorId: bigint;
      purpose: string;
      issuedDate: bigint;
      notes: string;
      bloodPressure: string;
      pulse: bigint;
      weight: bigint;
      height: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createHealthCertificate(
        data.patientId,
        data.doctorId,
        data.purpose,
        data.issuedDate,
        data.notes,
        data.bloodPressure,
        data.pulse,
        data.weight,
        data.height,
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["healthCertificates"] }),
  });
}

export function useDeleteHealthCertificate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteHealthCertificate(id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["healthCertificates"] }),
  });
}

// ── User Role ────────────────────────────────────────────────────
export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["callerUserRole"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.assignCallerUserRole(data.user, data.role);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["callerUserRole"] }),
  });
}

export type {
  Patient,
  Doctor,
  ServiceCatalog,
  Invoice,
  SuratKeteranganSakit,
  SuratKeteranganSehat,
};
