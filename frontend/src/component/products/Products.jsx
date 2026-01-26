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
    <div>
      {products.map((p) => (
        <div key={p._id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <p>
            {p.price.currency} {p.price.amount}
          </p>
          <p>Stock: {p.stock}</p>
        </div>
      ))}
    </div>
  );
};

export default Products