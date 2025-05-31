import { Button, IconButton } from '@mui/material'
import React, { useState } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
const ProductCard = ({ product }) => {
    const [favorite, setFavorite] = useState(false);

    const handleFavorite = () => {
        setFavorite(!favorite);
    }
    return (
        <div style={{ background: '#fafafa', borderRadius: 12, padding: 16, width: 320, position: 'relative', boxShadow: '0 2px 8px #eee' }}>
            <IconButton sx={{ position: 'absolute', top: 12, left: 12 }} onClick={handleFavorite}>
                {favorite ? <FavoriteIcon color='error' /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton sx={{ position: 'absolute', top: 52, left: 12 }}>
                <VisibilityIcon color='inherit' />
            </IconButton>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: 200, objectFit: 'contain', marginBottom: 12 }} />
            <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>{product.name}</div>
            <div style={{ marginBottom: 8 }}>
                <span style={{ color: '#E94560', fontWeight: 'bold', fontSize: 18, marginLeft: 8 }}>{product.price}</span>
                <span style={{ textDecoration: 'line-through', color: '#888', fontSize: 16 }}>{product.oldPrice}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>{'⭐'.repeat(Math.floor(product.rating))}{product.rating % 1 ? '⭐️' : ''}</span>
                <span style={{ color: '#888', fontSize: 14 }}>({product.reviews})</span>
            </div>
            <Button style={{ marginTop: 12, width: '100%', background: '#222', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontSize: 16 }}>
                أضف إلى السلة
            </Button>
        </div>
    )
}

export default ProductCard