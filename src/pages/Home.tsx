import { useEffect, useState } from 'react';
import Categories from '../components/Categories';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Sort from '../components/Sort';

function Home() {
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		fetch('https://68ea4faef1eeb3f856e6e022.mockapi.io/items')
			.then(response => {
				return response.json();
			})
			.then(json => {
				setItems(json);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);
	return (
		<>
			<div className='content__top'>
				<Categories />
				<Sort />
			</div>
			<h2 className='content__title'>Все пиццы</h2>
			<div className='content__items'>
				{isLoading
					? [...new Array(8)].map((_, index) => <Skeleton key={index} />)
					: items.map(pizza => <PizzaBlock key={pizza.id} {...pizza} />)}
			</div>
		</>
	);
}

export default Home;
