import React from "react";
import { useState } from "react";
import { useEffect, useTransition } from "react";
import OrderData from "../../../components/order/OrderData";
import axios from 'axios';
import Cookies from 'js-cookie'
import {
  OrderDetailsContainer,
  OrderDetailsList,
  SearchBarWrapper,
  SearchBarContainer,
  TableContainer,
  TableRowHeader,
  T_Head,
  GlobalStyles
} from "./components";

function OrderList() {
    const [loading, startTranstion] = useTransition();
    const [status, setStatus] = useState('all');
    const [orders, setOrders] = useState([])
    useEffect(() => {
      
        startTranstion(async () => {
            try {
              setOrders([])
                const res = await axios.get(`/api/admin/getOrders/${status}`, {
                  headers: {
                    userinfo: Cookies.get('userToken')
                  }
                });
                const {msg, success} = res.data;
                if(!success && msg?.includes('session expired')) {
                  return window.location.reload()
                }
                const {orders} = res.data;
                setOrders(orders);

            } catch (error) {
                console.error(error.message);
            }
        })
    }, [status]);

  return (
    <OrderDetailsContainer>
        <GlobalStyles />
      <h3>Order Details</h3>

      <p>
        In the order details section, you can review and manage all orders with
        their details. You can view and edit many information such as IDs of all
        orders, ordered product, order date, price and order status. Access to
        this area is limited. Only administrators and team leaders can reach.
        The changes you make will be approved after they are checked.
      </p>


      <OrderDetailsList>
        <SearchBarWrapper>
          <SearchBarContainer>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search for Order ID, Customer Name"
            />
          </SearchBarContainer>

          <select name="" id="" className="select" onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All Orders</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </SearchBarWrapper>

        <TableContainer>
            
          <TableRowHeader>
            <T_Head> Order ID </T_Head>
            <T_Head> Customer </T_Head>
            <T_Head> Order </T_Head>
            <T_Head> Delivery Date </T_Head>
            <T_Head> Delivery Price </T_Head>
            <T_Head> Delivery Status </T_Head>
            <T_Head> Payment </T_Head>
          </TableRowHeader>


          {
            orders?.length <= 0 ? (
              <h2>No Orders Yet</h2>
            )
            :
            orders?.map(order => (
              <OrderData key={order.id} data={order} />
            ))
          }
          
        </TableContainer>

      </OrderDetailsList>
    </OrderDetailsContainer>
  );
}

export default OrderList;
