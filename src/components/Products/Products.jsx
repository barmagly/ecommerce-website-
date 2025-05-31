import React, { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { Box, Grid, IconButton, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../ProductCard/ProductCard';


const Products = ({ products }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const [page, setPage] = useState(0);
    const [productsPerPage, setProductsPerPage] = useState(8);

    useEffect(() => {
        if (isMobile) {
            setProductsPerPage(1);
        } else if (isTablet) {
            setProductsPerPage(4);
        } else if (isDesktop) {
            setProductsPerPage(8);
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
            <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} justifyContent={{ xs: 'center', md: 'space-between' }} alignItems={'center'}>
                <div style={{ color: '#E94560', fontWeight: 'bold', fontSize: 24 }}>
                    اكتشف منتجاتنا
                </div>
                {arrowSection()}
            </Box>
            <Grid style={{ display: 'flex', flexWrap: 'wrap', gap: 35 }} py={3} justifyContent={{ xs: 'center', md: 'space-between' }} alignItems={'center'} >
                {currentProducts.map((product, idx) => (
                    <ProductCard product={product} idx={idx} key={idx} />
                ))}
            </Grid>
        </Grid>
    );
};

export default Products