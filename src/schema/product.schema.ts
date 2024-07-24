import { number, object, string, TypeOf } from "zod"

/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *         - user
 *       properties:
 *         name:
 *           type: string
 *           default: "Product 1"
 *         description:
 *           type: string
 *           default: "Very nice"
 *         price:
 *           type: number
 *           default: 100
 *         category:
 *           type: string
 *           default: "Hardware"
 *     ProductResponse:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 */

const payload = {
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    description: string({
      required_error: "Description is required",
    }),
    price: number({
      required_error: "Price is required",
    }),
    category: string({
      required_error: "Category is required",
    }),
  }),
}

const params = {
  params: object({
    productId: string({
      required_error: "productId is required",
    }),
  }),
}

export const createProductSchema = object({
  ...payload,
})

export const updateProductSchema = object({
  ...payload,
  ...params,
})

export const deleteProductSchema = object({
  ...params,
})

export const getProductSchema = object({
  ...params,
})

export type CreateProductInput = TypeOf<typeof createProductSchema>
export type UpdateProductInput = TypeOf<typeof updateProductSchema>
export type ReadProductInput = TypeOf<typeof getProductSchema>
export type DeleteProductInput = TypeOf<typeof deleteProductSchema>
