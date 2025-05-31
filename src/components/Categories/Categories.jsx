import React from 'react'
import { Box, Grid, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const categories = [
    {
        name: 'الكمبيوتر',
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png',
    },
    {
        name: 'الكمبيوتر',
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png',
    },
    {
        name: 'الكمبيوتر',
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png',
    },
    {
        name: 'الكمبيوتر',
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png',
    },
    {
        name: 'الكمبيوتر',
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png',
    },
    {
        name: 'الكمبيوتر',
        image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png',
    },
]

const Categories = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

    const [page, setPage] = useState(0);
    const [productsPerPage, setProductsPerPage] = useState(6);

    useEffect(() => {
        if (isMobile) {
            setProductsPerPage(1);
        } else if (isTablet) {
            setProductsPerPage(3);
        } else if (isDesktop) {
            setProductsPerPage(6);
        }
    }, [isMobile, isTablet, isDesktop]);

    const pageCount = Math.ceil(categories.length / productsPerPage);
    const startIdx = page * productsPerPage;
    const endIdx = startIdx + productsPerPage;
    const currentProducts = categories.slice(startIdx, endIdx);

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
            <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} justifyContent={{ xs: 'center', md: 'space-between' }} alignItems={'center'}>
                <div style={{ color: '#E94560', fontWeight: 'bold', fontSize: 24 }}>
                    التصنيفات
                </div>
                {arrowSection()}
            </Box>
            <Grid style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }} py={3} justifyContent={{ xs: 'center', md: 'space-evenly' }} alignItems={'center'}>
                {currentProducts.map((product, idx) => (
                    <div key={idx} style={{ background: '#fafafa', borderRadius: 12, border: '1px solid black', padding: 10, width: 180, position: 'relative', boxShadow: '0 2px 8px #eee' }}>
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: 180, objectFit: 'contain', marginBottom: 12 }} />
                        <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, textAlign: 'center' }}>{product.name}</div>
                    </div>
                ))}
            </Grid>
        </Grid>
    )
}

export default Categories