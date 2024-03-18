import React, { type CSSProperties, memo, useMemo, useState, useCallback } from 'react'

// material-ui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Box,
} from '@mui/material';

// thirds-party
import { Helmet } from 'react-helmet-async';
import { sentenceCase } from 'change-case';
import { useSelector } from 'react-redux';
import { useQuery, gql, useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import noDataForSerach from 'assets/img/illustrations/searching-data-3385493.png'
import * as Yup from 'yup';

// project imports
import Label from 'components/label';
import Iconify from 'components/iconify';
import { UserListHead, UserListToolbar } from 'components/sections/dashboard/user/list';
import { IOSSwitch } from 'components/switch/iosSwitchStyle';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { GoogleMap, Data } from '@react-google-maps/api'

const center: google.maps.LatLngLiteral = {
  lat: 38.805470223177466,
  lng: -118.76220703125,
}

const onClick = (e: google.maps.MapMouseEvent) => {
  console.log(
    'onClick args: ',
    e.latLng?.lat(),
    ' : ',
    e.latLng?.lng()
  )
}

const onDataLoad = (data: google.maps.Data) => {
  console.log('data: ', data)
}

function GoogleMaps() {

  const [map, setMap] = useState<google.maps.Map | null>(null)


  const onMapLoad = useCallback((map: google.maps.Map) => {
    console.log('map.data: ', map.data)
    // map.data.loadGeoJson('/geo.json')
    setMap(map)
  }, [])

  const dataOptions = useMemo<google.maps.Data.DataOptions | null>(() => {

    return map !== null ? {
      map,
      controlPosition: google.maps.ControlPosition.TOP_LEFT,
      controls: ['Point'],
      drawingMode: 'Point', //  "LineString" or "Polygon".
      featureFactory: (geometry: google.maps.Data.Geometry): google.maps.Data.Feature => {
        console.log('geometry: ', geometry)

        return new google.maps.Data.Feature({
          id: '1',
          geometry
        })
      }
    } : null
  }, [map])

  return (
    <div className='map'>
      <div className='map-container'>
        <GoogleMap
          id='data-example'
          mapContainerStyle={{
            borderRadius: "0.25rem",
            marginTop: "1.5rem",

          }}
          //   border- radius: 0.25rem;
          // margin-top: 1.5rem;
          // margin-bottom: 0.25rem;
          // overflow: hidden;
          zoom={5}
          center={center}
          onClick={onClick}
          onLoad={onMapLoad}
        >
          {dataOptions !== null ? (<Data onLoad={onDataLoad} options={dataOptions} />) : null}
        </GoogleMap>
      </div>
    </div>
  )
}

export default React.memo(GoogleMaps);