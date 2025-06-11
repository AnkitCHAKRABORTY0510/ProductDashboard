import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useState,useEffect } from "react";
import { useTheme, Box, MenuItem, FormControl, Select, InputLabel, Typography, Paper } from "@mui/material";


const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [chartData, setChartData] = useState([]);
  const [keys, setKeys] = useState([])
  const shouldRotateLabels = chartData.length > 10;
  const xAxisTickRotation = shouldRotateLabels ? 30 : 0;
  const [xAxisLegend, setXAxisLegend] = useState("Brand");


  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        const uniqueCategories = [...new Set(data.products.map((p) => p.category))];
        setCategories(uniqueCategories);
        setSelectedCategory(uniqueCategories[0]);
      });
  }, []);

useEffect(() => {
  if (selectedCategory) {
    const filtered = products.filter((p) => p.category === selectedCategory);
    const brandMap = {};
    let hasUnknownBrand = false;

    filtered.forEach((p) => {
      const brand = p.brand?.trim() || "Unknown";

      // If brand is unknown, we use the product title as key
      const key = brand === "Unknown" ? p.title : brand;
      if (brand === "Unknown") hasUnknownBrand = true;

      if (!brandMap[key]) {
        brandMap[key] = {
          brand: key,
          titleList: [],
        };
      }

      brandMap[key][p.title] = p.stock;
      brandMap[key].titleList.push(p.title);
    });

    const data = Object.entries(brandMap).map(([label, values]) => {
      const entry = {
        brand: label, // used as indexBy for X-axis
      };

      // Add each product title as a key with its stock value
      Object.keys(values).forEach((k) => {
        if (k !== "brand" && k !== "titleList") {
          entry[k] = values[k];
        }
      });

      return entry;
    });

    const allTitles = Array.from(new Set(filtered.map((p) => p.title)));

    // Set dynamic legend
    setXAxisLegend(hasUnknownBrand ? selectedCategory : "Brand");

    // Final chart setup
    setChartData(data);
    setKeys(allTitles);
  }
}, [selectedCategory, products]);


  return (

<Box
  sx={{
    width: isDashboard ? "100%" : "100%",
    height: isDashboard ? "100%" : { xs: "80px", sm: "250px", md: "450px", lg: "550px" },
    padding: isDashboard ? 3 : 5,
    margin: isDashboard ? 0 : 2,
    borderRadius: 2,
  }}
>
      <FormControl fullWidth sx={{ mb: 0 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          label="Category"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>


    <ResponsiveBar 
      data={chartData}
      keys={keys}
      indexBy="brand"
      theme={{
        // added
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
     
      margin={isDashboard 
    ? { top: 30, right: 30, bottom: 150, left: 50 } 
    : { top: 50, right: 130, bottom: 150, left: 60 }
  }
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: xAxisTickRotation,
          legend: xAxisLegend,
          legendPosition: "middle",
        legendOffset: 80,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Stock",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={
    isDashboard
      ? []
      : [
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]
  }

      tooltip={({ id, value, indexValue }) => {

      return (
        <Paper
          elevation={3}
          sx={{
            p: 1,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: 1,
            minWidth: 150,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {id}
          </Typography>
          <Typography variant="body2">
            contributes <strong>{value}</strong> stock to <strong>{indexValue}</strong>
          </Typography>
        </Paper>
      );
    }}

      role="application"
      barAriaLabel={(e) => `${e.id}: ${e.formattedValue} in ${e.indexValue}`}
    />

  </Box>
  );
};

export default BarChart;
