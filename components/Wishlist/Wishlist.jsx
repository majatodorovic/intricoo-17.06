"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/hooks/ecommerce.hooks";
import { Thumb } from "@/components/Thumb/Thumb";


const WishlistPage = () => {
  const { data: wishlistData, isFetching, refetch } = useWishlist();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!isFetching) {
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isFetching]);

  return (
    <>

      <h1
        className={`mx-auto my-10 w-full text-center text-[1.223rem] font-bold md:mb-16`}
      >
        Lista želja
      </h1>
      {loading ? (
        <div className={`flex h-screen w-full justify-center`}>
          {/* Simple Spinning Loader */}
          <div className="spinner" />
        </div>
      ) : wishlistData?.length > 0 ? (
        <div className="m-auto w-[90%] 2xl:w-[85%]">
          <div
            className={`${
              wishlistData?.length == 1 ? "grid-cols-1" : "grid-cols-2"
            } ml-0 mt-5 grid gap-x-5 gap-y-10 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4`}
          >
            {wishlistData?.map(({ id_product: id, index }) => {
              return (
                <Thumb
                  slug={id}
                  key={index}
                  refreshWishlist={refetch}
                  cancelIcon={true}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mx-auto flex flex-col items-center justify-center text-center max-sm:w-[95%]">
          <div className="flex flex-col items-center rounded-lg p-10">
            <h1 className="mb-3 text-lg font-medium">
              Vaša lista želja je prazna!
            </h1>{" "}
            <p>Kada dodate artikle u listu želja, oni će se pojaviti ovde.</p>
            <Link
              href="/"
              className="standard-link mt-4 flex w-[300px] items-center justify-center border border-black bg-white px-10 py-4 font-normal text-black transition-all duration-300 hover:bg-black hover:text-white"
            >
              Vrati se na početnu stranu
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default WishlistPage;
