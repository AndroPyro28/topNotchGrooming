import React, { useEffect, useState, useTransition } from "react";
import Product from "./Product";
import Sign_Products from "../../../components/sign/Sign_Products";

import {
  StorePageContainer,
  Banner,
  PetFilterWrapper,
  PetFilterContainer,
  PetContainer,
  ProductsWrapper,
  ProductsContainer,
  Content,
  CircleBackground,
  FilterProductContainer,
  Filter,
  FilterContainer,
} from "./storeComponents";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import Cookies from "js-cookie";
import storeLogic from "./storeLogic";

function Store() {
  const [activeFilter, setActiveFilter] = useState({
    petCategory: "",
    ageLimit: "",
    itemCategory: "",
    itemName: "",
  });
  const [refresher, setRefresher] = useState(false);
  const { setProps, shuffleArray, dropDownItemCategory, dropDownAgeGap } =
    storeLogic({ setActiveFilter });
  // const [loading, setLoading] = useState(false);
  const [loading, startTransition] = useTransition();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    startTransition(async () => {
      setProducts([]);
      try {
        const { petCategory, ageLimit, itemCategory, itemName } = activeFilter;
        if (!petCategory && !ageLimit && !itemCategory && !itemName) {
          const res = await axios.get("/api/products/getAllItems", {
            headers: {
              userinfo: Cookies.get("userToken"),
            },
          });
          const { products, success, msg } = res.data;

          if (msg?.includes("session expired") && !success) {
            toast(msg, { type: "error" });
            return window.location.reload();
          }

          setProducts(shuffleArray(products));
        } else {
          const res = await axios.post(
            "/api/products/searchItems",
            activeFilter,
            {
              headers: {
                userinfo: Cookies.get("userToken"),
              },
            }
          );

          const { success, products, msg } = res.data;

          if (msg?.includes("session expired") && !success) {
            toast(msg, { type: "error" });
            return window.location.reload();
          }
          setProducts(shuffleArray(products));
        }
      } catch (error) {
        console.error(error.message);
      }
    });
  }, [
    activeFilter.petCategory,
    activeFilter.itemName,
    activeFilter.ageLimit,
    activeFilter.itemCategory,
    refresher,
  ]);

  return (
    <StorePageContainer>
      <Banner>
        <ToastContainer autoClose />
        <Content>
          <h1>
            W e &nbsp; p r o v i d e &nbsp; w h a t &nbsp; y o u &nbsp; n e e d
            &nbsp; f o r &nbsp; a f f o r d a b l e &nbsp; p r i c e.
          </h1>
        </Content>
      </Banner>

      <PetFilterWrapper>
        <h1> W e &nbsp; D e a l &nbsp; I n</h1>
        <PetFilterContainer>
          <PetContainer
            active={activeFilter.petCategory.toLowerCase() === "dog"}
            id="dog"
            onClick={(e) =>
              setActiveFilter((prev) => ({
                ...prev,
                petCategory:
                  prev.petCategory === e.target.id ? "" : e.target.id,
              }))
            }
          >
            <CircleBackground id="dog" />
            <img src="/images/dog7.png" id="dog" />
            <h3 id="dog">Dog</h3>
            <p id="dog">Healthy food for active woof</p>
          </PetContainer>

          <PetContainer
            active={activeFilter.petCategory.toLowerCase() === "cat"}
            id="cat"
            onClick={(e) =>
              setActiveFilter((prev) => ({
                ...prev,
                petCategory:
                  prev.petCategory === e.target.id ? "" : e.target.id,
              }))
            }
          >
            <CircleBackground id="cat" />
            <img src="/images/cat1.png" id="cat" />
            <h3 id="cat">Cat</h3>
            <p id="cat">Healthy food for active meow</p>
          </PetContainer>
        </PetFilterContainer>
        <h1> P l e a s e &nbsp; C h o o s e &nbsp; H e r e </h1>
      </PetFilterWrapper>

      <ProductsWrapper>
        <h1>P r o d u c t s</h1>
        <i class="fa-solid fa-chevron-left left"></i>
        <i class="fa-solid fa-chevron-right right"></i>

        <FilterProductContainer>
          <FilterContainer>
            <Filter>
              <i className="fa-solid fa-magnifying-glass"></i>{" "}
              <input
                type={"text"}
                onChange={setProps}
                name="itemName"
                value={activeFilter.itemName}
                placeholder="Search item by name"
              />
            </Filter>
            <i
              className={`fa-solid fa-rotate productRefreshBtn`}
              onClick={() => setRefresher(!refresher)}
            ></i>
          </FilterContainer>

          <FilterContainer>
            <Filter>
              <span>Category: &nbsp;</span>
              <select
                name="itemCategory"
                value={activeFilter.itemCategory}
                onChange={setProps}
              >
                {dropDownItemCategory.map((option) => {
                  return (
                    <option key={option.key} value={option.value}>
                      {option.key}
                    </option>
                  );
                })}
              </select>
            </Filter>

            <Filter>
              <span>Age:&nbsp;</span>
              <select
                name="ageLimit"
                id=""
                value={activeFilter.ageLimit}
                onChange={setProps}
              >
                {dropDownAgeGap.map((option) => {
                  return (
                    <option key={option.key} value={option.value}>
                      {option.key}
                    </option>
                  );
                })}
              </select>
            </Filter>
          </FilterContainer>
        </FilterProductContainer>

        {loading ? (
          <h1>loading...</h1>
        ) : (
          <ProductsContainer>
            {products?.length > 0 ? (
              products?.map((product, index) => {
                return <Product product={product} key={index} />;
              })
            ) : (
              <Sign_Products />
            )}
          </ProductsContainer>
        )}

        <div class="pageNumber">
          <span class="activePage">1</span> / <span class="maxPage">2</span>{" "}
        </div>
      </ProductsWrapper>
    </StorePageContainer>
  );
}

export default Store;
