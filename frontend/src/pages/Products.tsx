import { useState } from '@lynx-js/react'
import { Header } from '$/components/Header.js'
import { ScrollView } from '$/components/ScrollView.js'
import { useNavigate } from 'react-router'
import '$/shared/layout.css'
import '$/shared/global.css'
import './Products.css'
import { walletTokens } from '../data/mockData.js'
import { SectionTitle } from '../components/SectionTitle.js'

interface ProductCategoryProps {
	title: string
	onPress: () => void
}

// Product category component
const ProductCategory = ({ title, onPress }: ProductCategoryProps) => (
	<view className="Products__category" bindtap={onPress}>
		<view className="Products__category-image" />
		<text className="Products__category-title">{title}</text>
	</view>
)

export default () => {
	const navigate = useNavigate()
	
	// Extract unique product categories from wallet tokens
	// For the demo, we'll just use hardcoded categories to match the screenshot
	const productCategories = [
		{ id: 1, title: 'CAMERA' },
		{ id: 2, title: 'HANDBAG' },
		{ id: 3, title: 'WATCH' },
		{ id: 4, title: 'WATCH' },
		{ id: 5, title: 'CAR' },
		{ id: 6, title: 'SUNGLASSES' }
	]
	
	const itemCount = walletTokens.length
	
	const handleCategoryPress = (categoryId: number) => {
		// In a real app, this would navigate to a category detail page
		console.log(`Category ${categoryId} pressed`)
	}
	
	return (
		<ScrollView>
			<Header />
			
			<view className="Products">
				<SectionTitle 
					title="YOUR PRODUCTS"
					subtitle={`${itemCount} ITEMS`}
				/>
				
				<view className="Products__grid">
					{productCategories.map(category => (
						<ProductCategory
							key={category.id}
							title={category.title}
							onPress={() => handleCategoryPress(category.id)}
						/>
					))}
				</view>
			</view>
		</ScrollView>
	)
} 