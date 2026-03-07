import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fratchProducts } from '../../redux/reducer/ProductSlice';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fratchProducts());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className='flex flex-col gap-4 justify-center items-center w-full'>
      {products.map((p) => (
        <div key={p._id} className='border border-gray-300 rounded-md p-4 w-full'>
          <h3 className='text-lg font-bold'>{p.title}</h3>
          <p className='text-gray-600'>{p.description}</p>
          <p className='text-gray-600'>
            {p.price.currency} {p.price.amount}
          </p>
          <p className='text-gray-600'>Stock: {p.stock}</p>
        </div>
      ))}
    </div>
  );
};

export default Products