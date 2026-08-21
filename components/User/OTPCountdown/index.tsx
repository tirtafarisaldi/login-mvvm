import type { FC } from 'react';
import type { OTPCountdownBtnProps } from './types';
import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from 'hooks/useDebounce';

const OTPCountdownBtn: FC<OTPCountdownBtnProps> = ({ text, otp, hidden, disabled = false }) => {
  const debounce = useDebounce();
  const [[hrs, mins, secs], setTime] = useState([0, 0, 0]);
  const [errMsg] = useState('');
  const [msg] = useState('');

  const tick = useCallback(() => {
    if (hrs === 0 && mins === 0 && secs === 0) return;
    else if (mins === 0 && secs === 0) {
      setTime([hrs - 1, 59, 59]);
    } else if (secs === 0) {
      setTime([hrs, mins - 1, 59]);
    } else {
      setTime([hrs, mins, secs - 1]);
    }
  }, [hrs, mins, secs]);

  useEffect(() => {
    debounce(() => {
      tick();
    }, 1000);
  }, [debounce, tick]);

  const callResendOTP = () => {
    window.alert('Resend OTP');
  };

  return (
    <>
      <button
        hidden={hidden}
        className="bg-red-500 text-white active:bg-red-200 text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-40 cursor-auto"
        type="button"
        disabled={disabled || !(hrs === 0 && mins === 0 && secs === 0)}
        onClick={callResendOTP}
      >
        {hrs === 0 && mins === 0 && secs === 0
          ? text
          : 'Wait ' +
            `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
              .toString()
              .padStart(2, '0')}`}
      </button>
      <p className="text-xs px-3 py-2 mt-1 bg-red-100 text-red-600 rounded-md" hidden={!errMsg}>
        {errMsg}
      </p>

      <p className="text-xs px-3 py-2 mt-1 bg-green-100 text-green-600 rounded-md" hidden={!msg}>
        {msg}
      </p>
    </>
  );
};

export default OTPCountdownBtn;
