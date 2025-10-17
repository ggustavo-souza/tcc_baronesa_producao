import React from "react";
import '../App.css';
import '../awesome/all.min.css'

function Footer() {
    return (
        <div class="container-fluid corFooter">
            <footer class="text-center text-lg-start">
                <div class="container-fluid d-flex justify-content-center py-5">
                    <button type="button" class="btn btn-warning btn-lg btn-floating mx-2 footerBotao">
                        <i class="fab fa-facebook-f"></i>
                    </button>
                    <button type="button" class="btn btn-warning btn-lg btn-floating mx-2 footerBotao">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                    <button type="button" class="btn btn-warning btn-lg btn-floating mx-2 footerBotao">
                        <i class="fab fa-instagram"></i>
                    </button>
                </div>
                <div class="text-center text-white p-3">
                    <p>© 2025 - 2025 Copyright</p>
                    <a class="text-white" href="https://www.abaronesa.com/"> A Baronesa - Movelaria</a>
                </div>
            </footer>
        </div>
    )
}

export default Footer;