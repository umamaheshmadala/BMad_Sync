import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import favoritesBusinessHandler from "../favorites-business.ts";
import favoritesCouponHandler from "../favorites-coupon.ts";
import favoritesGetHandler from "../favorites-get.ts";

Deno.test("favorites business requires params", async () => {
  const res = await favoritesBusinessHandler(new Request("http://localhost/api/user/favorites/business", { method: "POST" }), {} as any);
  assertEquals(res.status, 400);
});

Deno.test("favorites coupon requires params", async () => {
  const res = await favoritesCouponHandler(new Request("http://localhost/api/user/favorites/coupon", { method: "POST" }), {} as any);
  assertEquals(res.status, 400);
});

Deno.test("favorites get requires userId", async () => {
  const res = await favoritesGetHandler(new Request("http://localhost/api/user/favorites", { method: "GET" }), {} as any);
  assertEquals(res.status, 400);
});


