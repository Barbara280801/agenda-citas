import { expect, test } from "@playwright/test";

function futureDate() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

async function createAppointment(page) {
  await page.getByLabel("Nombre del cliente").fill("Ana Pérez");
  await page.getByLabel("Fecha").fill(futureDate());
  await page.getByLabel("Hora").fill("10:30");
  await page.getByLabel("Motivo").fill("Consulta inicial");
  await page.getByRole("button", { name: "Guardar cita" }).click();
}

test("restores appointment details and status after reload", async ({ page }) => {
  await page.goto("/");
  await createAppointment(page);

  await page.getByRole("button", { name: "Marcar como completada" }).click();
  await expect(page.getByText("Completada")).toBeVisible();

  await page.reload();

  await expect(page.getByText("Ana Pérez")).toBeVisible();
  await expect(page.getByText("Consulta inicial")).toBeVisible();
  await expect(page.getByText("Completada")).toBeVisible();
  await expect(page.getByRole("button", { name: "Marcar como pendiente" })).toBeVisible();
});

test("keeps primary actions usable without narrow-screen overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await createAppointment(page);

  await expect(page.getByRole("button", { name: "Guardar cita" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Marcar como completada" })).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
  ).toBe(true);
});
