import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, IconButton, useMediaQuery, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';


const FlashSales = ({ products }) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const [page, setPage] = useState(0);
    const [productsPerPage, setProductsPerPage] = useState(4);

    const [favorite, setFavorite] = useState(false);

    const handleFavorite = () => {
        setFavorite(!favorite);
    }

    useEffect(() => {
        if (isMobile) {
            setProductsPerPage(1);
        } else if (isTablet) {
            setProductsPerPage(2);
        } else if (isDesktop) {
            setProductsPerPage(4);
        }
    }, [isMobile, isTablet, isDesktop]);

    const pageCount = Math.ceil(products.length / productsPerPage);
    const startIdx = page * productsPerPage;
    const endIdx = startIdx + productsPerPage;
    const currentProducts = products.slice(startIdx, endIdx);

    const arrowSection = () => {
        const handlePrev = () => {
            setPage((prev) => (prev > 0 ? prev - 1 : prev));
        };
        const handleNext = () => {

            setPage((prev) => (prev < pageCount - 1 ? prev + 1 : prev));
            console.log(currentProducts);
        };
        return (
            <Box>
                <IconButton sx={{ background: 'rgb(245, 245, 245)', borderRadius: 12 }} onClick={handlePrev} disabled={page <= 0}>
                    <ArrowForwardIcon />
                </IconButton>
                <IconButton sx={{ background: 'rgb(245, 245, 245)', borderRadius: 12 }} onClick={handleNext} disabled={page >= pageCount - 1}>
                    <ArrowBackIcon />
                </IconButton>
            </Box>
        )
    }

    return (
        <Grid p={{ xs: 5, md: 8 }} >
            <div style={{ color: '#E94560', fontWeight: 'bold', fontSize: 24 }}>
                عروض اليوم السريعة
            </div>
            <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} justifyContent={{ xs: 'center', md: 'space-between' }} alignItems={'center'}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold', fontSize: 24 }}>03</div>
                        <div>الأيام</div>
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: 24 }}>:</div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold', fontSize: 24 }}>23</div>
                        <div>الساعات</div>
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: 24 }}>:</div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold', fontSize: 24 }}>19</div>
                        <div>الدقائق</div>
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: 24 }}>:</div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold', fontSize: 24 }}>56</div>
                        <div>الثواني</div>
                    </div>
                </div>
                {arrowSection()}
            </Box>
            <Grid style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 45 }} justifyContent={{ xs: 'center', md: 'space-between' }} alignItems={'center'} >
                {currentProducts.map((product, idx) => (
                    <div key={idx} style={{ background: '#fafafa', borderRadius: 12, padding: 16, width: 320, position: 'relative', boxShadow: '0 2px 8px #eee' }}>
                        <span style={{ position: 'absolute', top: 12, right: 12, background: '#E94560', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 14 }}>{product.discount}</span>
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
                ))}
            </Grid>
            <Button style={{ background: '#E94560', color: '#fff', border: 'none', padding: '12px 32px', fontSize: 18, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
                عرض جميع المنتجات
            </Button>
        </Grid>
    );
};

export default FlashSales; 