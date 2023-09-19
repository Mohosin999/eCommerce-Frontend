// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import ProductCard from "../components/product-card/ProductCard";
// import Wrapper from "../components/wrapper/Wrapper";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(
//           `http://127.0.0.1:1337/api/products?pagination[start]=${
//             (currentPage - 1) * itemsPerPage
//           }&pagination[limit]=${itemsPerPage}&populate=*`
//         );
//         setProducts(response.data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, [currentPage]);

//   const totalProducts = products?.meta?.pagination?.total;
//   const totalPages = Math.ceil(totalProducts / itemsPerPage);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   return (
//     <Wrapper>
//       <div className="grid grid-cols-1 gap-4 mt-28">
//         <div>
//           <div className="grid grid-cols-3 gap-x-5 gap-y-10">
//             {products?.data?.map((item) => (
//               <ProductCard key={item.id} item={item} />
//             ))}
//           </div>
//         </div>

//         <div className="bg-white mt-4 flex justify-center items-center">
//           <button
//             onClick={handlePreviousPage}
//             className={`mx-2 px-3 py-2 rounded-full focus:outline-none ${
//               currentPage === 1
//                 ? "bg-gray-300 text-gray-700 cursor-not-allowed"
//                 : "bg-blue-500 text-white"
//             }`}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           {Array.from({ length: totalPages }).map((_, index) => (
//             <button
//               key={index}
//               onClick={() => handlePageChange(index + 1)}
//               className={`mx-2 px-3 py-2 rounded-full focus:outline-none ${
//                 currentPage === index + 1
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-300 text-gray-700"
//               }`}
//             >
//               {index + 1}
//             </button>
//           ))}
//           <button
//             onClick={handleNextPage}
//             className={`mx-2 px-3 py-2 rounded-full focus:outline-none ${
//               currentPage === totalPages
//                 ? "bg-gray-300 text-gray-700 cursor-not-allowed"
//                 : "bg-blue-500 text-white"
//             }`}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </Wrapper>
//   );
// };

// export default ProductList;

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import ProductCard from "../components/product-card/ProductCard";
import Wrapper from "../components/wrapper/Wrapper";

const maxResult = 6;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  let [pageIndex, setPageIndex] = useState(1);
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState();
  const [searchOption, setSearchOption] = useState("");

  // Pagination logic - start
  const { data, isLoading } = useSWR(
    // Sorting endpoint
    sortOption
      ? `/api/products?populate=*&pagination[page]=${pageIndex}&pagination[pageSize]=${maxResult}&sort[0]=price:${sortOption}`
      : // Filtering endpoint
      filterOption
      ? `/api/products?populate=*&pagination[page]=${pageIndex}&pagination[pageSize]=${maxResult}&filters[price][$lte]=${filterOption}`
      : // Searching endpoint
      searchOption
      ? `/api/products?populate=*&pagination[page]=${pageIndex}&pagination[pageSize]=${maxResult}&filters[name][$eq]=${searchOption}`
      : // Root endpoint
        `/api/products?populate=*&pagination[page]=${pageIndex}&pagination[pageSize]=${maxResult}`,
    { fallbackData: products }
  );
  // Pagination logic - end

  return (
    <Wrapper>
      <div className="flex flex-wrap">
        <div className="w-1/3">
          <div className="mt-5">
            {/* Heading area */}
            <div className="flex">
              {/* Heading */}
              <h2 className="text-bold text-[24px] text-orange-600">
                More Actions <span className="text-gray-300">/</span>
              </h2>
            </div>

            {/* Features area */}
            <div className="mt-14">
              {/* Sorting - sort by price - start */}
              <div className="mt-4">
                <h3 className="text-bold text-[20px] text-green-600 mb-1">
                  Sort by Price
                </h3>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-gray-200 px-2 py-1 text-sm"
                >
                  <option value="">Default</option>
                  <option value="asc">Lowest to Highest</option>
                  <option value="desc">Highest to Lowest</option>
                </select>
              </div>
              {/* Sorting - sort by price - end */}

              {/* Filtering - filter by price - start */}
              <div className="mt-10">
                <h3 className="text-bold text-[20px]  text-green-600 mb-1">
                  Filter by Price
                </h3>
                <input
                  value={filterOption}
                  onChange={(e) => setFilterOption(e.target.value)}
                  type="search"
                  placeholder="equal and less than"
                  className="bg-gray-200 px-2 py-1 text-sm"
                />
              </div>
              {/* Filtering - filter by price - end */}

              {/* Filter by name - start */}
              <div className="mt-10">
                <h3 className="text-bold text-[20px] text-green-600 mb-1">
                  Filter by Name
                </h3>
                <input
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                  type="search"
                  placeholder="type exect name"
                  className="bg-gray-200 px-2 py-1 text-sm"
                />
              </div>
              {/* Filter by name - end */}
            </div>
          </div>
        </div>

        {/* Show fetching products grid - start */}
        <div className="w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 mt-5 mb-5 px-5 md:px-0">
          {products?.data?.map((product) => {
            return <ProductCard key={product?.id} data={product} />;
          })}
        </div>
        {/* Show fetching products grid - end */}

        {/* Pagination button - start */}
        {data?.meta?.pagination?.total > maxResult && (
          <div className="flex gap-3 items-center justify-center my-16 md:mb-8 md:mt-0 ml-auto">
            <button
              disabled={pageIndex === 1}
              onClick={() => setPageIndex(pageIndex - 1)}
            >
              Previous
            </button>

            <span>{`${pageIndex} of ${
              data && data.meta.pagination.pageCount
            }`}</span>

            <button
              disabled={pageIndex === (data && data.meta.pagination.pageCount)}
              onClick={() => setPageIndex(pageIndex + 1)}
            >
              Next
            </button>
          </div>
        )}
        {/* Pagination button - end */}
        {/* If loading, then this loading logo shows - start */}
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-white/[0.5] flex flex-col gap-5 justify-center items-center">
            <img src="/logo.svg" width={150} />
            <span className="text-2xl font-medium">Loading...</span>
          </div>
        )}
        {/* If loading, then this loading logo shows - start */}
      </div>
    </Wrapper>
  );
};

export default ProductList;
