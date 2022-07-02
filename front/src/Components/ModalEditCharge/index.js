import { useState } from 'react';
import Charges from '../../assets/charges.svg';
import CloseIcon from '../../assets/close-icon.svg';
import useGlobalContext from '../../hooks/useGlobalContext.js';
import api from '../../services/api';
import './styles.css';

function ModalEditCharge({ open, handleClose }) {
  const { token, currentCharge } = useGlobalContext();

  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [value, setValue] = useState("");
  const [dueDate, setDueDate] = useState("");

  function handleClear() {
    setDescription("");
    setStatus("");
    setValue("");
    setDueDate("");
  }

  async function handleSubmitCharge(e) {
    e.preventDefault();

    if (status !== "pago" && status !== "pendente") {
      alert("Escolha um status");
      return;
    }

    if (dueDate.length > 10) {
      alert("A data deve ter o máximo de 10 caracteres");
      return;
    }

    try {
      const response = await api.post(`/cobrancas/${currentCharge.id}`, {
        descricao: description,
        status,
        valor: value,
        vencimento: dueDate,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status > 204) {
        return;
      }

      alert("Cobrança cadastrada com sucesso!");
      handleClear();
    } catch (error) {
      alert(
        error.message ??
        "O vencimento deve ser no formato dia/mês/ano. Com dia, mês e ano válidos"
      );
    }
  }

  return (
    <>
      {open && (
        <div className="backdrop">
          <div className="modal-container mod-modal-container">
            <img
              className="close-icon"
              src={CloseIcon}
              alt="close icon"
              onClick={handleClose}
            />

            <form className="modal-form" onSubmit={handleSubmitCharge}>
              <div className="modal-edit-input mod-modal-edit-input">
                <div className="header-customers-icon">
                  <img src={Charges} alt="customers icon" />
                  <h2>Cadastro da cobrança</h2>
                </div>
                <label className="nunito-14">
                  Nome
                  <input
                    placeholder={`${currentCharge.cliente}`}
                    type="text"
                    readonly="readonly"
                  />
                </label>
                <label className="nunito-14 new-height">
                  Descrição (opcional)
                  <input
                    placeholder=""
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>
                <div className="mod-modal-edit-row">
                  <label className="nunito-14">
                    Valor*
                    <input
                      placeholder="Ex: 1500"
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      required
                    />
                  </label>

                  <label className="nunito-14">
                    Vencimento*
                    <input
                      placeholder="Ex: 31/12/1999"
                      type="text"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </label>
                </div>
                Status*
                <div className="container-labels">
                  <div className="container-radio">
                    <label className="nunito-14 mod-nunito-14" htmlFor="pago">
                      <input
                        type="radio"
                        name="pago"
                        value="pago"
                        checked={status === "pago"}
                        onChange={() => setStatus("pago")}
                      />
                    </label>

                    <label
                      className="nunito-14 mod-nunito-14"
                      htmlFor="pendente"
                    >
                      <input
                        type="radio"
                        name="pendente"
                        value="pendente"
                        checked={status === "pendente"}
                        onChange={() => setStatus("pendente")}
                      />
                    </label>
                  </div>

                  <div className="status-paid">
                    <span>Pago</span>
                    <span>Pendente</span>
                  </div>
                </div>
              </div>

              <div className="btn-modal-customers">
                <button className="btn-cancel" onClick={() => handleClear()}>
                  Cancelar
                </button>
                <button className="btn-pink" type="submit">
                  Aplicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ModalEditCharge;