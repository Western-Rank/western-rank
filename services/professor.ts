import { prisma } from "@/lib/db";

export async function getAllProfessorsSearch() {
  return prisma.professor.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}
