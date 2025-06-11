import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import { saveAs } from "file-saver";


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width:768px)");

  // CSV conversion utility
const convertToCSV = (data) => {
  const array = Array.isArray(data) ? data : [data];
  const headers = Object.keys(array[0]).join(",");
  const rows = array.map(obj => Object.values(obj).join(",")).join("\n");
  return `${headers}\n${rows}`;
};

// Trigger CSV download
const handleDownload = () => {
  const storedData = localStorage.getItem("products"); 
  if (!storedData) {
    alert("No data found in localStorage!");
    return;
  }

  try {
    const parsedData = JSON.parse(storedData);
    const csv = convertToCSV(parsedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // Save the file
    saveAs(blob, "localStorageData.csv");
  } catch (err) {
    console.error("Error parsing or converting data:", err);
  }
};

  return (
    <Box m={isMobile ? "10px" : "20px"}>
      {/* HEADER */}
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} justifyContent="space-between" alignItems={isMobile ? "flex-start" : "center"}>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box mt={isMobile ? 2 : 0}>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "12px",
              fontWeight: "bold",
              padding: "8px 16px",
            }}
            onClick={handleDownload}
          >
            <DownloadOutlinedIcon sx={{ mr: "8px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={isMobile ? "repeat(1, 1fr)" : "repeat(12, 1fr)"}
        gridAutoRows="minmax(140px, auto)"
        gap="20px"
      >
        {/* ROW 1 */}
        {[{
          title: "19,236,100",
          subtitle: "Product Sold",
          progress: "0.65",
          increase: "+43%",
          icon: <ShoppingCartIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
        }, {
          title: "43,110,225",
          subtitle: "Stock Available",
          progress: "0.85",
          increase: "+25%",
          icon: <ShowChartRoundedIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
        }, {
          title: "1,900,244",
          subtitle: "Current Customers",
          progress: "0.30",
          increase: "+16%",
          icon: <PersonAddIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
        }, {
          title: "1,325,134",
          subtitle: "Order Received",
          progress: "0.80",
          increase: "+43%",
          icon: <CategoryRoundedIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
        }].map((stat, idx) => (
          <Box
            key={idx}
            gridColumn={isMobile ? "span 12" : "span 3"}
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox {...stat} />
          </Box>
        ))}

        {/* ROW 2 - Revenue & Transactions */}
        <Box
          gridColumn={isMobile ? "span 12" : "span 12"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box mt="25px" px="30px" display="flex" justifyContent="space-between" alignItems="center" flexDirection={isMobile ? "column" : "row"}>
            <Box mb={isMobile ? 2 : 0}>
              <Typography variant="h6" fontWeight="600" color={colors.grey[100]}>
                Product Stock Status
              </Typography>
              <Typography variant="h4" fontWeight="bold" color={colors.greenAccent[500]}>
                $740,002,034
              </Typography>
            </Box>
            <IconButton>
              <DownloadOutlinedIcon sx={{ fontSize: "26px", color: colors.greenAccent[500] }} />
            </IconButton>
          </Box>
          <Box height="400px" mt={isMobile ? "10px" : "-20px"}>
            {/* <LineChart isDashboard /> */}
             <BarChart isDashboard />
          </Box>
        </Box>

        {/* <Box
          gridColumn={isMobile ? "span 12" : "span 4"}
          gridRow="span 1"
          backgroundColor={colors.primary[400]}
          overflow="hidden"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
            <Typography color={colors.grey[100]} variant="h6" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box key={`${transaction.txId}-${i}`} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
              <Box>
                <Typography color={colors.greenAccent[500]} variant="h6" fontWeight="600">
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>{transaction.user}</Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box backgroundColor={colors.greenAccent[500]} p="5px 10px" borderRadius="4px">
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box> */}

        {/* ROW 3 - Campaign, Sales, Geo */}
        {/* <Box gridColumn={isMobile ? "span 12" : "span 4"} gridRow="span 2" backgroundColor={colors.primary[400]} p="30px">
          <Typography variant="h6" fontWeight="600">Campaign</Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
            <ProgressCircle size="125" />
            <Typography variant="h6" color={colors.greenAccent[500]} mt="15px">
              $48,352 revenue generated
            </Typography>
            <Typography align="center">Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>

        <Box gridColumn={isMobile ? "span 12" : "span 4"} gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Typography variant="h6" fontWeight="600" p="30px 30px 0 30px">
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard />
          </Box>
        </Box>

        <Box gridColumn={isMobile ? "span 12" : "span 4"} gridRow="span 2" backgroundColor={colors.primary[400]} p="30px">
          <Typography variant="h6" fontWeight="600" mb="15px">
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard />
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;
