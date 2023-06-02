/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Loading from "../../../components/custom/loading";
import MessageBox from "../../../components/custom/message";
import HistoryCard from "../../../components/historyCard";
import HistoryTable from "../../../components/historyTable";
import { GetOrderQueryHistory } from "../../../components/hook/orderHooks";
import { ApiError } from "../../../types/ApiError";
import { getError } from "../../../utils/getError";
import { Store } from "../../../utils/store";
import { useContext, useEffect } from "react";
import Layout from "../../../components/layout";
import { useNavigate } from "react-router-dom";

function OrderHistory() {
  const navigate = useNavigate()

  const { state } = useContext(Store);
  const { userInfo } = state;

  const { data: orderHistory, isLoading, error } = GetOrderQueryHistory();

  useEffect(() => {
    if (!userInfo) {
      navigate("/user/signin");
    }
  }, [userInfo, navigate]);

  return (
    <Layout title="History" description="Order History Page">
      {isLoading ? (
        <Loading.History />
      ) : error ? (
        <MessageBox>{getError(error as ApiError)}</MessageBox>
      ) : (
        <div className="container">
          <div className="overflow-auto shadow-lg rounded-lg hidden md:block">
            <HistoryTable orderHistory={ orderHistory! }/>
          </div>

          <div className="block md:hidden">
            <HistoryCard orderHistory={ orderHistory! } />
          </div>
        </div>
      )}
    </Layout>
  );
}

export default OrderHistory;
