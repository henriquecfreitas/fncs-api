import * as request from "supertest"
import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"

import { AppModule } from "src/modules/app/app.module"

describe("FNCS API e2e Tests", () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it("/ (GET)", () => {
    return request(app.getHttpServer()).get("/").expect(204)
  })

  const mockUserEmail = `e2emock-${Math.random().toString().split(".")[1]}@email.com`
  it("/users (POST)", () => {
    return request(app.getHttpServer())
      .post("/users")
      .send({
        name: "Mock User",
        email: mockUserEmail,
        password: "mockpassword",
      })
      .expect(201)
  })

  it("/login (POST) | Unauthorized", () => {
    return request(app.getHttpServer())
      .post("/login")
      .send({
        email: mockUserEmail,
        password: "wrongpassword",
      })
      .expect(401)
  })

  let accessToken: string
  it("/login (POST)", () => {
    return request(app.getHttpServer())
      .post("/login")
      .send({
        email: mockUserEmail,
        password: "mockpassword",
      })
      .expect(201)
      .expect(res => {
        accessToken = res.headers["access-token"]
        if (!accessToken) throw new Error("Missing access-token header")
      })
  })

  it("/expenses (POST) | Unauthorized", () => {
    return request(app.getHttpServer())
      .post("/expenses")
      .send({
        description: "Uber ride",
        value: 20.24,
        date: "2024-05-09T19:02:34.904Z",
      })
      .expect(403)
  })

  it("/expenses (POST)", () => {
    return request(app.getHttpServer())
      .post("/expenses")
      .auth(accessToken, { type: "bearer" })
      .send({
        description: "Uber ride",
        value: 20.24,
        date: "2024-05-09T19:02:34.904Z",
      })
      .expect(201)
  })

  let expenseId: string
  it("/expenses (GET)", () => {
    return request(app.getHttpServer())
      .get("/expenses")
      .auth(accessToken, { type: "bearer" })
      .expect(200)
      .expect(res => {
        if (!res.body?.length) throw new Error("Missing expenses")
        expenseId = res.body[0].id
        if (!expenseId) throw new Error("Invalid expenses payload format")
      })
  })

  it("/expenses/:id (GET)", () => {
    return request(app.getHttpServer())
      .get(`/expenses/${expenseId}`)
      .auth(accessToken, { type: "bearer" })
      .expect(200)
  })

  it("/expenses/:id (PUT)", async () => {
    await request(app.getHttpServer())
      .put(`/expenses/${expenseId}`)
      .send({ description: "New description" })
      .auth(accessToken, { type: "bearer" })
      .expect(200)

    return request(app.getHttpServer())
      .get(`/expenses/${expenseId}`)
      .auth(accessToken, { type: "bearer" })
      .expect(200)
      .expect(res => {
        const { description } = res.body
        if (description !== "New description")
          throw new Error("Unpersisted update operation")
      })
  })

  it("/expenses/:id (DELETE)", async () => {
    await request(app.getHttpServer())
      .delete(`/expenses/${expenseId}`)
      .auth(accessToken, { type: "bearer" })
      .expect(204)

    return request(app.getHttpServer())
      .get(`/expenses/${expenseId}`)
      .auth(accessToken, { type: "bearer" })
      .expect(404)
  })
})
