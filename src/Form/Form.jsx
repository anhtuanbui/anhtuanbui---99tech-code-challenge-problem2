import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  TextField,
  Autocomplete,
  CircularProgress,
} from "@mui/material";

import "./Form.scss";

function Form() {
  const API_URL = "https://interview.switcheo.com/prices.json";
  const [data, setData] = useState();
  const [currentCurrency, setCurrentCurrency] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [autocompleteValue, setAutocompleteValue] = useState(null);

  const sendRef = useRef("");
  const receiveRef = useRef("");
  const currencyRef = useRef("");

  const [sendErrorHelper, setSendErrorHelper] = useState({});
  const [receiveErrorHelper, setReceiveErrorHelper] = useState({});

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      });
  }, []);

  var currencies = [];

  if (data) {
    currencies = data.map((currency, i) => ({
      id: i + 1,
      currency: currency.currency,
      label: currency.currency,
      price: currency.price,
    }));
  }

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      console.log(sendRef.current.value);
      console.log(currencyRef.current.value);
      console.log(receiveRef.current.value);
      sendRef.current.value = "";
      receiveRef.current.value = "";

      setCurrentCurrency({});
      setAutocompleteValue(null);

      setIsLoading(false);
    }, 2000);
  };

  const handleAmountToSendChange = (e) => {
    let value = Number(e.target.value);
    if (isNaN(value) || value < 0) {
      setSendErrorHelper({
        error: true,
        helperText: "Please enter a valid non-negative number",
      });
      receiveRef.current.value = "";
    } else {
      setSendErrorHelper({
        error: false,
      });
      if (currentCurrency && currentCurrency.price) {
        let receivedAmount =
          Math.round(value * currentCurrency.price * 100) / 100;
        receiveRef.current.value = isNaN(receivedAmount) ? "" : receivedAmount;
      }
    }
  };

  const handleAmountToReceiveChange = (e) => {
    let value = Number(e.target.value);
    if (isNaN(value) || value < 0) {
      setReceiveErrorHelper({
        error: true,
        helperText: "Please enter a valid non-negative number",
      });
      sendRef.current.value = "";
    } else {
      setReceiveErrorHelper({
        error: false,
      });
      if (currentCurrency && currentCurrency.price) {
        let sentAmount =
          Math.round((value / currentCurrency.price) * 100) / 100;
        sendRef.current.value = isNaN(sentAmount) ? "" : sentAmount;
      }
    }
  };

  const handleCurrencyChange = (e, value) => {
    setCurrentCurrency(value);
    setAutocompleteValue(value);
    if (value && value.price) {
      if (sendRef.current.value) {
        let receivedAmount =
          Math.round(sendRef.current.value * value.price * 100) / 100;
        receiveRef.current.value = isNaN(receivedAmount) ? "" : receivedAmount;
      } else if (receiveRef.current.value) {
        let sentAmount =
          Math.round((receiveRef.current.value / value.price) * 100) / 100;
        sendRef.current.value = isNaN(sentAmount) ? "" : sentAmount;
      }
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <h4 className="title">Swap from USD</h4>

      <TextField
        label="Amount to send"
        variant="outlined"
        sx={{ width: 300 }}
        type="number"
        onChange={handleAmountToSendChange}
        inputRef={sendRef}
        error={sendErrorHelper.error}
        helperText={sendErrorHelper.helperText}
        value={sendRef.current.value || ""}
        InputLabelProps={
          sendRef.current.value ? { shrink: true } : { shrink: false }
        }
      />
      <br />
      <Autocomplete
        options={currencies}
        getOptionKey={(option) => option.id}
        isOptionEqualToValue={(option, value) =>
          option.currency === value.currency
        }
        onChange={handleCurrencyChange}
        value={autocompleteValue}
        sx={{ width: 300, marginTop: 2 }}
        renderInput={(params) => (
          <TextField {...params} label="Currency" inputRef={currencyRef} />
        )}
      />
      <br />
      <TextField
        label="Amount to receive"
        variant="outlined"
        sx={{ width: 300, marginBottom: 2 }}
        type="number"
        onChange={handleAmountToReceiveChange}
        inputRef={receiveRef}
        error={receiveErrorHelper.error}
        helperText={receiveErrorHelper.helperText}
        value={receiveRef.current.value || ""}
        InputLabelProps={
          receiveRef.current.value ? { shrink: true } : { shrink: false }
        }
      />
      <br />
      <Button
        variant="contained"
        type="submit"
        sx={{ width: 300 }}
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        {isLoading ? "PROCESSING..." : "CONFIRM SWAP"}
      </Button>
    </form>
  );
}

export default Form;
