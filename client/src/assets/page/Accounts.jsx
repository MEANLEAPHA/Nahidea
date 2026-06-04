import React, { useState, useEffect } from "react";
import {useLocation, Outlet, useNavigate} from 'react-router-dom';
import "../style/page/Accounts.css";
import {MenuOutlined} from '@ant-design/icons';


export default function Accounts() {
    const location = useLocation();   
    const navigate = useNavigate();
 
  
  return (
    <div className="accounts-page">
      <div className="accounts-header">  
        <div id='acc-banner' style={{ "--preview-url-banner": `url(https://media.newyorker.com/photos/665f65409ad64d9e7a494208/16:9/w_1280,c_limit/Chayka-screenshot-06-05-24.jpg)` }}>
            <img src='https://media.newyorker.com/photos/665f65409ad64d9e7a494208/16:9/w_1280,c_limit/Chayka-screenshot-06-05-24.jpg' id="img-banner"/>
            <button type="button" id='btn-edit-pf'><span id='btn-edit-pf-span'>Edit Profile</span></button>
        </div>
        <div id='acc-pf-info'>
            <div className='acc-pf-info-child acc-pf-info-child-left'>
                <div id='acc-pf-div'>
                     <div className="status-pf-online"></div>
                    <img src='https://media.tenor.com/ZlZZTd366EYAAAAe/we-have-no-sappers-dog-accepting-fate.png' id='acc-pf'/>
                   
                </div>
                <div id="user-pf-iden">
                    <p id='username-pf'>
                        Ha MeanLeap
                    </p>
                    <p id='user-profession-pf'>Programmar</p>
                </div>
            </div>
            <div className='acc-pf-info-child acc-pf-info-child-right'>
                <div style={{display:'flex', gap:'8px'}}>
                     <button className='pf-act-btn' type="button" >Follow</button>
                    <button className='pf-act-btn' type="button">Message</button>
                    <button className='pf-act-btn' type="button">Poked</button>
                </div>
                <button className='pf-act-btn' type="button"><MenuOutlined /></button>
            </div>
            
        </div>
      </div>
      <div className="accounts-body">  
        <div id="data-outlet">
            <div id="outlet-link-dev">
                <button
              className="btn-outlet-link"
              style={
                location.pathname === "/accounts/all"
                  ? {
                      color: "var(--primary-color)",
                      borderBottom: "2px solid var(--primary-color)",
                      fontWeight: "bold"
                    }
                  : {}
              }
              onClick={() => navigate("/accounts/all")}
            >
              All
            </button>
            <button
              className="btn-outlet-link"
              style={
                location.pathname === "/accounts/posts"
                  ? {
                      color: "var(--primary-color)",
                      borderBottom: "2px solid var(--primary-color)",
                      fontWeight: "bold"
                    }
                  : {}
              }
              onClick={() => navigate("/accounts/posts")}
            >
              Posts
            </button>
            <button
              className="btn-outlet-link"
              style={
                location.pathname === "/accounts/socialactivity"
                  ? {
                      color: "var(--primary-color)",
                      borderBottom: "2px solid var(--primary-color)",
                      fontWeight: "bold"
                    }
                  : {}
              }
              onClick={() => navigate("/accounts/socialactivity")}
            >
              Social Activity
            </button>
            </div>
            <div id="outlet-link-result">
                <Outlet />
            </div>

        </div>
        <div id='data-full-info'>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat dolorem non voluptatem vero a doloribus maiores, deserunt perferendis animi natus repudiandae quibusdam earum corrupti possimus quaerat sequi rerum quo aspernatur.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat dolorem non voluptatem vero a doloribus maiores, deserunt perferendis animi natus repudiandae quibusdam earum corrupti possimus quaerat sequi rerum quo aspernatur.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat dolorem non voluptatem vero a doloribus maiores, deserunt perferendis animi natus repudiandae quibusdam earum corrupti possimus quaerat sequi rerum quo aspernatur.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat dolorem non voluptatem vero a doloribus maiores, deserunt perferendis animi natus repudiandae quibusdam earum corrupti possimus quaerat sequi rerum quo aspernatur.</p>
            
        </div>

      </div>
    </div>
  );
}