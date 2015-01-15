<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <head>
        <style type="text/css">
          html,body {
          font-family:Arial;
          margin: 0px;
          }
          td
          {
          font-size:13px;
          }
          .samplename
          {
          font-size:16px;
          color:#ffffff;
          height:26px;
          background-color:#6d96ac;
          }
          .category
          {
          font-size:16px;
          color:#ffffff;
          height:30px;
          background-color:#6d96ac;
          }
          .contents
          {
          padding: 6px 10px 14px 10px;
          }
          table#widgets td
          {
          border: solid 1px #6d96ac;
          border-collapse: collapse;
          }
          .widgetname
          {
          font-weight: bold;
          text-align: center;
          width: 20%;
          word-break:break-all;
          }
          table#references td
          {
          width: 100%;
          border: 0px;
          border-spacing: 0px;
          padding: 5px;
          }
          .refname
          {
          width: 100%;
          font-weight: bold;
          }
        </style>
      </head>
      <body>
        <table width="100%" border="0" cellspacing="0">
          <tr>
            <td class="samplename" align="center">
              <xsl:value-of select="Overview/SampleName"/>
              <xsl:text disable-output-escaping="yes"><![CDATA[]]></xsl:text>
			  <!--
              <xsl:value-of select="Overview/SampleVersion"/>
			  -->
            </td>
          </tr>
          <tr bgcolor="#FFFFFF">
            <td class="contents">
			  <strong>Type</strong>: JavaScript
			  <p>
              <xsl:value-of select="Overview/Description"/>
			  </p>
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="#FFFFFF" height="260px">
              <img>
                <xsl:attribute name="src">
                  <xsl:value-of select="Overview/Preview"/>
                </xsl:attribute>
              </img>
            </td>
          </tr>
        </table>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
