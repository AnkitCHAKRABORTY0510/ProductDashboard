import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";

const Bar = () => {
  return (
    <Box m="20px">
      <Header title="Product Stock Bar Chart" subtitle="Products Vs Stock" />
        <BarChart />

    </Box>
  );
};

export default Bar;
