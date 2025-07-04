import {getOrdersHandler} from "../../../../handler/order"

export async function GET(){
  const orders = await getOrdersHandler()
  if(!orders){
    return Response.json({
      status: 404,
      message: "No orders found"
    })
  }
  return Response.json(orders)
}