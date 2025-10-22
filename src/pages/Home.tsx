import { useEffect, useState } from 'react';

import Categories from '../components/Categories';
import Pagination from '../components/Pagination';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Sort from '../components/Sort';

function Home({ searchValue }) {
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [categoryId, setCategoryId] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortType, setSortType] = useState({
		name: 'популярности',
		sortProperty: 'rating',
	});

	useEffect(() => {
		setIsLoading(true);

		const category = categoryId > 0 ? `category=${categoryId}` : '';
		const search = searchValue ? `&search=${searchValue}` : '';
		fetch(
			`https://68ea4faef1eeb3f856e6e022.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortType.sortProperty}&order=desc${search}`
		)
			.then(response => {
				return response.json();
			})
			.then(json => {
				setItems(json);
			})
			.finally(() => {
				setIsLoading(false);
			});
		window.scrollTo(0, 0);
	}, [categoryId, sortType, searchValue, currentPage]);

	return (
		<div className='container'>
			<div className='content__top'>
				<Categories
					value={categoryId}
					onChangeCategory={i => setCategoryId(i)}
				/>
				<Sort value={sortType} onChangeSort={i => setSortType(i)} />
			</div>
			<h2 className='content__title'>Все пиццы</h2>
			<div className='content__items'>
				{isLoading
					? [...new Array(8)].map((_, index) => <Skeleton key={index} />)
					: items.map(pizza => <PizzaBlock key={pizza.id} {...pizza} />)}
			</div>
			<Pagination onChangePage={number => setCurrentPage(number)} />
		</div>
	);
}

export default Home;
