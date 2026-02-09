import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Product } from "@/app/types/productInterface";
import Link from "next/link";
import Image from "next/image";
import AddToCartBtn from "../AddToCartBtn/AddToCartBtn";
import AddToFavorites from "../AddToFavorites/AddToFavorites";

export function ProductCard({product}: {product: Product}) {
  return (
    <Card className="relative cursor-pointer mx-auto w-full sm:max-w-sm pt-0 rounded-2xl  gap-0 border-0 bg-linear-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <Link href={`/productdetails/${product._id}`} >
        <Image
        src={product.imageCover}
        alt={product.title}
        width={400}
        height={300}
        // loading="lazy" 
        className="object-cover aspect-square text-center mx-auto rounded-t-2xl"
      />
      <CardHeader className="pt-2 w-full">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs px-2 py-1">
              <svg className="w-5 h-5 text-yellow-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" viewBox="0 0 24 24"><path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" /></svg>
              {product.ratingsAverage} out of 5 ({product.ratingsQuantity})
            </Badge>
            {/* <div className="relative h-6 overflow-hidden">
            <ul 
            className={product.priceAfterDiscount !== undefined && product.quantity !== undefined && product.quantity < 100 ?
             'text-right animate-scroll-up space-y-1' 
             :
             'text-right space-y-1'}>
              {product.priceAfterDiscount !== undefined && (
                <li className="text-sm font-medium text-green-600 whitespace-nowrap">
                  {Math.round((product.priceAfterDiscount / product.price) * 100)}% OFF
                </li>
              )}
              {product.quantity !== undefined && product.quantity < 100 && (
                <li className="text-sm font-medium text-red-600 whitespace-nowrap">
                  Selling Out Fast
                </li>
              )}
              {product.priceAfterDiscount !== undefined && (
                <li className="text-sm font-medium text-green-600 whitespace-nowrap">
                  {Math.round((product.priceAfterDiscount / product.price) * 100)}% OFF
                </li>
              )}
              {product.quantity !== undefined && product.quantity < 100 && (
                <li className="text-sm font-medium text-red-600 whitespace-nowrap">
                  Selling Out Fast
                </li>
              )}
            </ul>
            </div> */}
          </div>
      </CardHeader >
      <CardAction  className="absolute px-2.5 w-full top-2.5 right-0 left-0 flex items-center justify-between">
        {product.priceAfterDiscount !== undefined && product.priceAfterDiscount < product.price &&
          <Badge
          className="px-3 bg-green-50 text-green-800 border border-primary">{Math.round((product.priceAfterDiscount / product.price) * 100)}% OFF</Badge>
        }
      </CardAction>
      {/* content */}
      <CardContent>
        <CardTitle className="line-clamp-1" title={product.title}>{product.title.split(' ').slice(0,4).join(' ')}</CardTitle>
        <CardDescription title={product.description} className="pt-3 mb-2 line-clamp-2 max-h-13">
        {product.description?.length 
            ? product.description
            : 'No description available'}
        </CardDescription>
      </CardContent>
      </Link>
      {/* footer */}
      <CardFooter className="flex items-center justify-between pt-4 sm:pt-0 mt-auto">
        {product.priceAfterDiscount !== undefined && product.priceAfterDiscount < product.price ?
         <p className="text-lg font-bold whitespace-nowrap text-right truncate">EGP  {product.priceAfterDiscount} <span className="line-through text-gray-300 font-normal">{product.price}</span></p> 
         : 
         <p className="text-lg font-bold whitespace-nowrap text-right truncate"> EGP {product.price}</p>
         }
        <div className="flex gap-2 relative">
          <AddToFavorites productId={product._id}/>
          <AddToCartBtn productId={product._id} />
        </div>
      </CardFooter>
    </Card>
  )
}
