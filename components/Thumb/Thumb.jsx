"use client";
import { useState, forwardRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import { convertHttpToHttps } from "@/helpers/convertHttpToHttps";
import ProductPrice from "@/components/ProductPrice/ProductPrice";
import { getColorByColorName } from "@/helpers/getColorByColorName";
import noImage from "../../public/images/placeholder.webp";
import Link from "next/link";
import { pushToDataLayer } from "@/_services/data-layer";
import {
  useAddToWishlist,
  useIsInWishlist,
  useProductThumb,
  useRemoveFromWishlist,
} from "@/hooks/ecommerce.hooks";

export const Thumb = forwardRef(
  (
    { slug, categoryId, refreshWishlist = () => {}, cancelIcon = false },
    ref,
  ) => {
    // SVE IDE OVDE UNUTAR FUNKCIJE

    const { data: product } = useProductThumb({
      slug: slug,
      id: slug,
      categoryId: categoryId ?? "*",
    });
    const { mutate: addToWishlist, isSuccess: isAdded } = useAddToWishlist();
    const { mutate: removeFromWishlist, isSuccess: isRemoved } =
      useRemoveFromWishlist();

    const { data: wishlist_data, refetch } = useIsInWishlist({ id: slug });

    useEffect(() => {
      refetch();
      refreshWishlist();
    }, [isAdded, isRemoved, refetch, refreshWishlist]);
    const [swiper, setSwiper] = useState(null);

    const variantOptionColor = product?.variant_options?.find((variant) => {
      return (
        variant?.attribute?.name === "boja" ||
        variant?.attribute?.name === "Boja" ||
        variant?.attribute?.name === "color" ||
        variant?.attribute?.name === "Color"
      );
    });

    const [selected, setSelected] = useState(
      variantOptionColor
        ? [
            {
              attribute_key: variantOptionColor.attribute.key,
              value_key: variantOptionColor.values[0].key,
            },
          ]
        : [],
    );
    const isInWishlist = {
      exist: wishlist_data?.exist,
      wishlist_item_id: wishlist_data?.wishlist_item_id,
    };

    const imageList = variantOptionColor?.values
      ? variantOptionColor?.values
      : product?.image.slice(0, 3).length > 0
        ? product.image.slice(0, 3)
        : [{ product_image: noImage }];

    let link = `${product?.slug_path}`;

    selected.length > 0 &&
      product?.variant_options?.forEach((option) => {
        if (option.attribute.key === selected[0].attribute_key) {
          const currentColor = option.values.find(
            (value) => value.key === selected[0].value_key,
          );
          if (currentColor) link += `-${currentColor.slug}`;
        } else {
          link += `-${option.values[0].slug}`;
        }
      });

    const discount_number = Math.abs(
      product?.price?.min?.price?.original -
        product?.price?.min?.price?.discount,
    );
    const discount_percent = Math.ceil(
      (discount_number / product?.price?.min?.price?.original) * 100,
    );

    return (
      <div
        key={slug}
        className="item hoveredColor thumbComponent relative col-span-1 aspect-2/3"
      >
        <div className={`item relative aspect-2/3 w-full`}>
          <Swiper
            modules={[]}
            rewind
            noSwiping={true}
            noSwipingClass="swiper-slide"
            initialSlide={product?.image?.findIndex(
              (item) => item === product?.image[0],
            )}
            breakpoints={{
              320: {
                allowTouchMove: false,
              },
              600: {
                allowTouchMove: false,
              },
              1024: {
                // bez navigation i pagination
              },
            }}
            className={`categoryImageSwiper relative h-full w-full`}
            onSwiper={(swiperInstance) => {
              setSwiper(swiperInstance);
            }}
          >
            {imageList?.map((item, index) => {
              let url;
              if (item) {
                if (
                  item.product_image &&
                  typeof item.product_image === "string"
                ) {
                  url = item.product_image;
                } else if (typeof item === "string") {
                  url = item;
                }
              }

              return (
                <SwiperSlide key={`${slug}-${index}`}>
                  <Link
                    href={link}
                    className="relative cursor-pointer"
                    style={{ display: "block" }}
                    onClick={() => {
                      pushToDataLayer("view_item", product);
                    }}
                  >
                    <img
                      ref={ref}
                      src={url ? convertHttpToHttps(url) : noImage}
                      alt={product?.basic_data?.name}
                      sizes={
                        "(max-width: 639px) 100vw, (max-width: 767px) 100vw, (max-width: 1023px) 100vw, (max-width: 1279px) 100vw, (min-width: 1600px) 50vw"
                      }
                      className={`h-full w-full object-cover transition-all duration-500 ease-in-out hover:scale-110`}
                    />
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {cancelIcon && (
            <Image
              src={"/icons/cancel.png"}
              alt="cancel"
              width={30}
              height={30}
              onClick={() => {
                removeFromWishlist({ id: isInWishlist?.wishlist_item_id });
              }}
              className="hover:bg-gray-200 absolute bottom-[10px] left-0 right-0 z-20 m-auto cursor-pointer rounded-full p-[5px] text-center lg:hidden"
            />
          )}
          <div
            id="thumb-onhover-actions"
            className="align-center chevrons absolute z-10 flex w-full justify-center bg-white"
            style={{
              width: "calc(100% - 12px)",
              margin: "0 6px",
              bottom: "6px",
              padding: "0",
            }}
          >
            <div
              className="group mx-3 cursor-pointer rounded-full p-1 hover:bg-topHeader"
              title="Kupi"
            >
              <Link href={link}>
                <Image
                  src={"/icons/shopping-bag.png"}
                  className="group-hover:invert"
                  alt="buy"
                  width={23}
                  height={23}
                />
              </Link>
            </div>
            <div
              title="Dodaj u listu želja"
              onClick={() => {
                if (!isInWishlist?.exist) {
                  addToWishlist({ id: slug, name: product?.basic_data?.name });
                } else {
                  removeFromWishlist({ id: isInWishlist?.wishlist_item_id });
                }
              }}
              className={`group mx-3 inline-flex scale-90 cursor-pointer rounded-full p-1 max-md:hidden ${isInWishlist?.exist ? "" : "hover:bg-topHeader"} `}
            >
              <Image
                src={
                  isInWishlist?.exist
                    ? `/icons/heart-active.png`
                    : `/icons/heart.png`
                }
                alt="wishlist"
                className={`!block ${
                  isInWishlist?.exist ? "" : "group-hover:invert"
                }`}
                width={26}
                height={26}
              />
            </div>
          </div>
          {product?.price?.discount?.active ? (
            <div className="absolute right-5 top-5 z-[1] font-light text-whiteSmoke">
              <div className="bg-primary px-4 py-0.5 text-base 2xl:text-lg">
                -
                {(
                  ((product?.price?.price?.original -
                    product?.price?.price?.discount) /
                    product?.price?.price?.original) *
                  100
                ).toFixed(0)}
                %
              </div>
            </div>
          ) : product?.price?.min?.price?.original &&
            product.price?.min?.price?.discount ? (
            <div className="absolute right-5 top-5 z-[1] font-light text-whiteSmoke">
              <div className="bg-primary px-4 py-0.5 text-base 2xl:text-lg">
                -{discount_percent}%
              </div>
            </div>
          ) : null}
          {product?.stickers?.length > 0 && (
            <div
              className={`absolute left-5 top-5 z-[1] flex flex-col gap-2 text-center text-whiteSmoke`}
            >
              {product?.stickers?.map((sticker, index) => {
                return (
                  <div
                    className={`bg-primary px-2 py-0.5 text-base font-light 2xl:px-4 2xl:text-lg`}
                    key={index}
                  >
                    {sticker?.name}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="z-[50] mt-2 flex flex-col items-start gap-1.5">
          <div className="relative flex items-center justify-start">
            <Link
              href={link}
              className="relative cursor-pointer max-sm:line-clamp-1"
            >
              <h3
                className="line-clamp-2 text-left text-xl font-light"
                title={
                  product?.basic_data?.name.length > 63
                    ? product?.basic_data?.name
                    : ""
                }
              >
                {product?.basic_data?.name}
              </h3>
            </Link>
          </div>
          {variantOptionColor?.values && (
            <div className="flex items-center justify-start gap-[0.5rem]">
              {variantOptionColor?.values?.map((item3, index) => {
                const variantAttributeKey = variantOptionColor?.attribute?.key;
                const isSelected = selected.find(
                  (item) =>
                    item?.attribute_key === variantAttributeKey &&
                    item?.value_key === item3?.key,
                );
                const colorBySlug = getColorByColorName(item3?.slug);

                if (index > 2) {
                  if (index === 3) {
                    return (
                      <div key="more-colors" className="text-sm">
                        + još boja
                      </div>
                    );
                  }
                  return null;
                }

                return (
                  <div
                    key={item3?.key}
                    className={`${
                      !isSelected ? "hover:opacity-40" : ""
                    } relative flex h-[18px] w-[18px] min-w-[18px] cursor-pointer items-center justify-center rounded-full text-center text-xs transition-all duration-500`}
                    style={{
                      backgroundColor: item3?.image ? "" : colorBySlug,
                      border:
                        item3.name === "Bela" || item3.name === "BELA"
                          ? "1px solid black"
                          : "transparent",
                    }}
                    onClick={() => {
                      setSelected((prevSelected) => {
                        // Remove previous selections with the same variantAttributeKey
                        const filteredSelections = prevSelected.filter(
                          (selection) =>
                            selection.attribute_key !== variantAttributeKey,
                        );
                        return [
                          ...filteredSelections,
                          {
                            attribute_key: variantAttributeKey,
                            value_key: item3?.key,
                          },
                        ];
                      });

                      const imageIndex = variantOptionColor?.values.findIndex(
                        (value) =>
                          value?.product_image === item3?.product_image,
                      );

                      if (imageIndex !== -1 && swiper) {
                        swiper.slideTo(imageIndex);
                      }
                    }}
                  >
                    {isSelected && (
                      <div
                        className={`absolute h-[16px] w-[16px] rounded-full border-2 bg-transparent ${
                          item3.name === "Bela" || item3.name === "BELA"
                            ? "border-black/20"
                            : "border-white"
                        } `}
                      ></div>
                    )}

                    {item3?.image && (
                      <Image
                        src={item3?.image}
                        alt="Boja"
                        className="rounded-full"
                        sizes="18px"
                        width={18}
                        height={18}
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <ProductPrice
            price={product?.price}
            inventory={product?.inventory}
            is_details={false}
          />
        </div>
      </div>
    );
  },
);
Thumb.displayName = "Thumb";
