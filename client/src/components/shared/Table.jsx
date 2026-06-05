import { DataGrid } from '@mui/x-data-grid'
import { Container, Paper, Typography } from '@mui/material'

const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
    console.log("Columns:", columns); // Add logging here
    return (
        <Container sx={{
            height: "100vh"
        }}>
            <Paper
                elevation={3}
                sx={{
                    padding: "1rem 4rem",
                    borderRadius: "1rem",
                    margin: "auto",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    boxShadow: "none"
                }}
            >
                <Typography
                    variant="h6"
                    textAlign={"center"}
                    sx={{
                        textTransform: "uppercase",
                        margin: "2rem",
                        fontWeight: "bold"
                    }}
                >{heading}</Typography>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowHeight={rowHeight}
                    style={{
                        height: "80%"
                    }}
                    sx={{
                        border: "none",
                        ".table-header": {
                            bgcolor: "rgba(0,0,0,0.7)",
                            color: "white"
                        }
                    }}
                />
            </Paper>
        </Container>
    )
}

export default Table
