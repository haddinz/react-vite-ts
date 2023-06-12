/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Button from "../../components/custom/button";
import Icon from "../../components/custom/icon";
import { CartItems } from "../../types/Cart";
import { Store } from "../../utils/store";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/layout";

function Cart() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search).get("redirect");
  const redirect = params ? params : "/cart/shipping/";

  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const [inputQuantity, setInputQuantity] = useState<{ [key: string]: number }>(
    {}
  );

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    itemID: string
  ) => {
    const value = parseInt(e.target.value);
    setInputQuantity((prevInputQuantity) => ({
      ...prevInputQuantity,
      [itemID]: value,
    }));
  };
  const updateHandler = (item: CartItems, quantity: number) => {
    if (item.countInStock < quantity) {
      toast.warning("Product Count In Stock", { autoClose: 1000 });
      return;
    }
    dispatch({ type: "ADD_CART_ITEMS", payload: { ...item, quantity } });
  };
  const removeHandler = (item: CartItems) => {
    dispatch({ type: "REMOVE_CART_ITEMS", payload: item });
    toast.success("Remove Success", { autoClose: 1000 });
  };
  const checkOutHandler = () => {
    navigate(`/user/signin?redirect=${redirect}`);
  };
  return (
    <Layout title="Cart" description="Cart Page">
      <div className="bg-sky-700 h-min[75vh] py-5">
        <div className="container text-white">
          <div className="text-center center font-bold text-2xl uppercase mb-10">
            Cart Page
          </div>
          {cartItems.length === 0 ? (
            <div className="h-44 flex justify-center items-center">
              <div>
                Cart Is Empty
                <Link to="/">
                  <span className="text-yellow-200 font-semibold">
                    {" "}
                    Go To Product
                  </span>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="col-span-2">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="grid col-span-1 md:grid-cols-2 gap-2 mb-10"
                    >
                      <div className="flex">
                        <div className="mb-5 relative">
                          <Link to={`/product/slug/${item.slug}`}>
                            <img
                              alt={item.name}
                              src={item.image}
                              className="h-30 w-28"
                            />
                          </Link>
                          <button
                            className="absolute -top-3 left-24 text-red-600 bg-white bg-opacity-70 rounded-full"
                            onClick={() => removeHandler(item)}
                          >
                            <Icon.Times />
                          </button>
                        </div>
                        <div className="ml-10 text-sm md:text-lg">
                          <p className="font-semibold">{item.name}</p>
                          <p className="mb-5">$ {item.price}</p>
                          <p className="font-semibold ">
                            Product Total:{" "}
                            <span className="text-yellow-400">
                              $ {item.quantity * item.price}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="mb-10 flex items-center justify-center">
                        <button
                          onClick={() => updateHandler(item, item.quantity + 1)}
                          disabled={item.countInStock === item.quantity}
                        >
                          <Icon.Plus />
                        </button>
                        <form
                          key={item._id}
                          onSubmit={() => {
                            updateHandler(
                              item,
                              inputQuantity[item._id] || item.quantity
                            );
                          }}
                        >
                          <input
                            type="number"
                            name={item.name}
                            id={item._id}
                            value={
                              inputQuantity[item._id] !== undefined
                                ? inputQuantity[item._id]
                                : item.quantity
                            }
                            onChange={(e) => inputHandler(e, item._id)}
                            className="w-16 bg-transparent text-center focus:outline-none focus:outline-none[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            disabled={item.countInStock === item.quantity }
                          />
                        </form>
                        <button
                          onClick={() => updateHandler(item, item.quantity - 1)}
                          disabled={item.quantity === 1}
                        >
                          <Icon.Minus />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pb-2 col-span-2 lg:col-span-1">
                  <h3 className="pb-2 font-bold uppercase mb-5">Check Out</h3>
                  <div className="border-b-4 border-lime-500 pb-10 mb-5">
                    <div className="flex justify-between">
                      Quantity Item:{" "}
                      <span className="font-semibold text-lg">
                        {cartItems.reduce((a, b) => a + b.quantity, 0)} PCS
                      </span>
                    </div>
                    <div className="flex justify-between">
                      Cart Total:{" "}
                      <span className="font-semibold text-lg">
                        ${" "}
                        {cartItems.reduce(
                          (a, b) => a + b.price * b.quantity,
                          0
                        )}
                      </span>
                    </div>
                  </div>
                  <Button
                    text="Check Out"
                    condition="on"
                    onClickHandler={checkOutHandler}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Cart;
