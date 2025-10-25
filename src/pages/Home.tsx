import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchContext } from '../App';
import Categories from '../components/Categories';
import Pagination from '../components/Pagination';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Sort from '../components/Sort';
import { setCategoryId } from '../redux/slices/filterSlice';

function Home() {
	const dispatch = useDispatch();
	const categoryId = useSelector((state: any) => state.filter.categoryId);
	const sortType = useSelector((state: any) => state.filter.sort.sortProperty);

	const { searchValue } = useContext(SearchContext);
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);

	const onChangeCategory = id => {
		dispatch(setCategoryId(id));
	};

	useEffect(() => {
		setIsLoading(true);

		const category = categoryId > 0 ? `category=${categoryId}` : '';
		const search = searchValue ? `&search=${searchValue}` : '';
		fetch(
			`https://68ea4faef1eeb3f856e6e022.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortType}&order=desc${search}`
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
	}, [categoryId, searchValue, currentPage, sortType]);

	return (
		<div className='container'>
			<div className='content__top'>
				<Categories
					value={categoryId}
					onChangeCategory={i => onChangeCategory(i)}
				/>
				<Sort />
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
