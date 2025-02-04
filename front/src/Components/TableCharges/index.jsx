import {TableContainer ,Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import ChargesDelete from '../../assets/chargesDelete.svg';
import ChargesEdit from '../../assets/chargesEdit.svg';
import OrganizeIcon from '../../assets/organize-icon.svg';
import useGlobalContext from '../../hooks/useGlobalContext';
import api from '../../services/api';
import ModalDeleteCharge from '../ModalDeleteCharge';
import ModalDetailCharge from '../ModalDetailCharge';
import ModalEditCharge from '../ModalEditCharge';
import './style.css';

export default function TableCharges({searchValue}) {
  const [openModalDetailCharge, setOpenModalDetailCharge] = useState(false);
  const [openModalEditCharge, setOpenModalEditCharge] = useState(false);
  const [openModalDeleteCharge, setOpenModalDeleteCharge] = useState(false);
  const [clickedOrganizeChargesCustomer, setClickedOrganizeChargesCustomer] = useState(false);
  const [clickedOrganizeChargesId, setClickedOrganizeChargesId] = useState(false);
  const [clickedOrganizeIconId, setClickedOrganizeIconId] = useState(false);
  const { 
    token, 
    chargesArray, 
    setChargesArray, 
    setCurrentCharge 
  } = useGlobalContext();

  function handleStopPropagation(e){
    e.stopPropagation();
  }

  function handleVerifyDataCharge(row) {
    setCurrentCharge(row);
  }

  useEffect(() => {
    async function handleLoadChargesOrdenation() {
      try {
        const response = await api.get(`/cobranca?query=${searchValue}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status > 204) {
          return;
        }
  
        clickedOrganizeIconId?
        setChargesArray(
          clickedOrganizeChargesId?
          [...response.data].sort((a,b)=>(b.id-a.id)):
          [...response.data].sort((a,b)=>(a.id-b.id))
        ):
        setChargesArray(
          clickedOrganizeChargesCustomer?
          [...response.data].sort((a,b)=>(b.cliente).localeCompare(a.cliente)):
          [...response.data].sort((a,b)=>(a.cliente).localeCompare(b.cliente))
        );
      } catch (error) {
        alert(error);
        window.location.reload();
      }
    }
    
    handleLoadChargesOrdenation();
  }, [searchValue, token, clickedOrganizeIconId, setChargesArray, clickedOrganizeChargesId, clickedOrganizeChargesCustomer]);

  return (
    <TableContainer>
      <Table
        sx={{ minWidth: "28rem" }}
        size="medium"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            <TableCell className="title-table">
            <div
              className="display"
              onClick={() => setClickedOrganizeIconId(false)}
            >
              <img
                src={OrganizeIcon}
                alt="organize"
                onClick={() => setClickedOrganizeChargesCustomer(!clickedOrganizeChargesCustomer)}
              />
            </div>
            <span>Cliente</span>
          </TableCell>
          <TableCell className="title-table">
            <div
              className="display"
              onClick={() => setClickedOrganizeIconId(true)}
            >
              <img
                src={OrganizeIcon}
                alt="organize"
                onClick={() => setClickedOrganizeChargesId(!clickedOrganizeChargesId)}
              />
            </div>
            <span>ID Cob.</span>
          </TableCell>
          <TableCell className="title-table">Valor</TableCell>
          <TableCell className="title-table">Data de venc.</TableCell>
          <TableCell className="title-table">Status</TableCell>
          <TableCell className="title-table">Descrição</TableCell>
          <TableCell className="title-table"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody onClick={() => setOpenModalDetailCharge(true)}>
          {chargesArray.map((row, index) => (
            <TableRow
              key={row.id}
              onClick={() => handleVerifyDataCharge(row)}
              className="table-row table-customers"
            >
              <TableCell component="th" scope="row" className="table-items">
                <span className="resized-text">{row.cliente}</span>
              </TableCell>
              <TableCell className="table-items">
                <span className="resized-text">{row.id}</span>
              </TableCell>
              <TableCell className="table-items">
                <span className="resized-text">
                  {`R$ ${Number(row.valor).toFixed(2)}`.replace(".", ",")}
                </span>
              </TableCell>
              <TableCell className="table-items">
                {new Date(row.vencimento).toLocaleDateString()}
              </TableCell>
              <TableCell className="table-items">
                <span
                  className={
                    (row.status === "pago" && "status-color in-day") ||
                    (row.status === "vencido" && "status-color defaulter") ||
                    (row.status === "pendente" && "status-color in-day-pending")
                  }
                >
                  {row.status}
                </span>
              </TableCell>
              <TableCell className="table-items ">
                <span className="resized-text">{row.descricao}</span>
              </TableCell>
              <TableCell className="table-items">
                <div
                  className="container-edit-delete-icons"
                  onClick={(e) => handleStopPropagation(e)}
                >
                  <div onClick={() => handleVerifyDataCharge(row)}>
                    <img
                      className="edit-icon"
                      src={ChargesEdit}
                      alt="editar cobranca"
                      onClick={() => setOpenModalEditCharge(true)}
                    />
                    <img
                      className="delete-icon"
                      src={ChargesDelete}
                      alt="excluir cobranca"
                      onClick={() => setOpenModalDeleteCharge(true)}
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ModalDetailCharge
        openModalDetailCharge={openModalDetailCharge}
        handleClose={() => setOpenModalDetailCharge(false)}
      />

      <ModalEditCharge
        openModalEditCharge={openModalEditCharge}
        handleClose={() => setOpenModalEditCharge(false)}
      />

      <ModalDeleteCharge
        openModalDeleteCharge={openModalDeleteCharge}
        handleClose={() => setOpenModalDeleteCharge(false)}
      />
    </TableContainer>
  );
}