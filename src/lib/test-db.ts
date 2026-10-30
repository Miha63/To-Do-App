
import { prisma } from "./prisma";

async function main() {
  const todo = await prisma.todo.create({
    data: {
      name: "Naučiti Prisma ORM",
      completed: false,
    },
  });

  console.log("Uspješno kreiran Todo:");
  console.log(todo);

  const todos = await prisma.todo.findMany();

  console.log("Svi Todo zapisi:");
  console.log(todos);
}

main()
  .catch((error) => {
    console.error("Greška:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
