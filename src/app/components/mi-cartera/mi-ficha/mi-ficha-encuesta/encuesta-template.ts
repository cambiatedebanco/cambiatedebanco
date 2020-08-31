
export function templateMailingDiferimiento(url_encuesta, contact_mail, email, temp_unsubscribe_url){
    return  `<html>
<head>
    <title>Caja Los Andes</title>
    <meta charset="UTF-8">
    <style type="text/css">.contenedor{width:600px; max-width: 600px; margin: auto;} 
        .lista{list-style: none; }
    </style>
</head>
<body>
<div align="center" border="1" bordercolor="#515151" class="contenedor" width="600"><!-- Legales -->
<div align="center" style="background-color: #f2f2f2;">
<table border="0" cellpadding="0" cellspacing="0" height="39" id="table26" style="max-width:441px;font-size:10px;color:#666666;font-family:verdana;text-decoration:none;line-height:12px; display:block;" width="80%">
<tbody>
<tr>
<td valign="top">
<div align="center">
<table border="0" cellpadding="0" cellspacing="0" id="table27" style="max-width:546px; display:block;" width="100%">
<tbody>
  <tr>
    <td style="font-size:10px;color:#666666;font-family:verdana;text-decoration:none;line-height:12px; display:block;">
                <div align="center">
                <span style="font-size: 9px">Para asegurar la entrega de nuestros e-mail en su correo, por favor agregue  ${contact_mail} a su libreta de direcciones de correo.<br />
    </span></div>
    </td>
  </tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>

<table border="0" cellpadding="0" cellspacing="0" width="600">
<tbody>
<tr>
</tr>
</tbody>
</table>
</div>
<table width="600" border="0" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td><img src="http://images.masterbase.com/v1/cajalosandesmktcl/b/1/encuesta-diferimiento_01.jpg" width="600" height="376" alt=""/></td>
</tr>
<tr>
<td><p style="font-family: arial; font-size: 22px; font-weight: bold; text-align: center; color: #009fe3; margin: 20px; ">¡Queremos saber tu opinión!</p>
<p style="font-family: arial; font-size: 15px; text-align: center; color: #515151; margin: 20px;">Preocupados de entregarte una mejor experiencia, te invitamos a responder <br>2 preguntas para evaluar la atención y mejorar nuestro servicio.</p>
</td>
</tr>
<tr>
<td><a href="${url_encuesta}"><img src="http://images.masterbase.com/v1/cajalosandesmktcl/b/1/encuesta-diferimiento_03.jpg" width="600" height="106" alt=""/></a></td>
</tr>
<tr>
<td><img src="http://images.masterbase.com/v1/cajalosandesmktcl/b/1/encuesta-diferimiento_04.jpg" width="600" height="66" alt=""/></td>
</tr>
</tbody>
</table>
<div align="center" style="background-color: #f2f2f2;">
<table border="0" cellpadding="0" id="table29" style="border-collapse: collapse" width="600">
<tbody>
<tr>
    <td align="left" style="font-size:10px; display:block; color:#666666;font-family:verdana;text-decoration:none;line-height:12px;" width="596">
    <div align="center">Este correo electrónico ha sido enviado a ${email}<br />
    Para modificar su suscripción, haga <a href="${temp_unsubscribe_url}" style="text-decoration: none;color:#33b1e7;" target="_blank"> click aquí</a> | Para anular su suscripción, haga <a href="#!masterunsubscribelink!#">clic aquí</a></div>
    </td>
</tr>
<tr>
    <td align="left" width="596">
    <hr color="#BECCCC" size="0" /></td>
</tr>
<tr>
<td align="left" height="50" style=" border-spacing:0p;font-size:10px;color:#666666;font-family:verdana;text-decoration:none;line-height:12px;" valign="top" width="596">
    <div>
        <div align="center">
        Este correo electrónico fue enviado a través de CEOcrm por <strong> CAJA LOS ANDES</strong><br/>
Dirección: General Calderón 121 - Providencia, Santiago.<br/><strong>©2020 Derechos Reservados</strong>
        </div>
    </div>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</body>
</html>`
}