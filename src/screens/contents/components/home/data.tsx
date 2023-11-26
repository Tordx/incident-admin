import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { reportdata } from '../../../../types/interfaces';
import Maps from './map';
import { CalculateDistance } from '../../../../firebase/function';
import ReactAudioPlayer from 'react-audio-player';
import { doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';

export default function Data({ item,  isLoading, isSuccess }: { item: reportdata[], isLoading: (e: boolean) => void, isSuccess: (e: boolean) => void }) {

  return (
    <div className='dashboard-data-on'>
     
    </div>
  );
}
