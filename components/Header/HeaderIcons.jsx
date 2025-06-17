"use client";
import { useCartBadge, useWishlistBadge } from "@/hooks/ecommerce.hooks";
import Link from "next/link";
import Image from "next/image";

const HeaderIcons = () => {
  const { data: cartCount } = useCartBadge();
  const { data: wishListCount } = useWishlistBadge();
  return (
    <div className="flex items-center gap-4">
      <Link href="/login">
        <Image
          src="/icons/user.png"
          width={20}
          height={20}
          className="h-auto w-5 object-cover"
          alt="user"
        />
      </Link>
      <Link href="/korpa" className="relative">
        <Image
          src="/icons/shopping-bag.png"
          width={24}
          height={24}
          className="h-auto w-6 object-cover"
          alt="shopping-bag"
        />
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-whiteSmoke">
          {cartCount}
        </span>
      </Link>
      <Link href="/lista-zelja">
        <div className="relative">
          <Image
            src="/icons/heart.png"
            width={24}
            height={24}
            className="mx-2 h-auto object-cover"
            alt="heart"
          />
          {wishListCount != 0 && (
            <span className="absolute -right-1 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-topHeader text-xs text-white">
              {wishListCount}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default HeaderIcons;
