import { prisma } from "@/lib/db";
import { ProfessorResponse } from "@/lib/professors";

export async function getAllProfessorsSearch(): Promise<ProfessorResponse> {
  return prisma.professor.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}
