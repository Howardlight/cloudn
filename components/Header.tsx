import {AppBar, Box, Toolbar, Typography, Button} from "@mui/material";
import Link from 'next/link';

const Header = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar className="static bg-transparent backdrop-blur-sm shadow-transparent shadow-none">
                <Toolbar>
                    <Link href="/">
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            className="color-white opacity-75 hover:opacity-100"
                            sx={{
                                mr: 2,
                                display: "flex",
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                textDecoration: 'none',
                                flexGrow: 1,
                            }}
                        >
                            CLOUDN
                        </Typography>
                    </Link>
                    <a href="https://github.com/Howardlight/cloudn">
                        <Button className="opacity-75 font-semibold hover:opacity-100 text-white bg-transparent ">
                            ABOUT
                        </Button>
                    </a>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Header;