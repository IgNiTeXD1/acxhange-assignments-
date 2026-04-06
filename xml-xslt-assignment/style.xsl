<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html" indent="yes"/>

<!-- Key for grouping -->
<xsl:key name="classKey" match="student" use="class"/>

<xsl:template match="/school">
<html>
<head>
<style>
body { font-family: Arial; }
.top { background-color: lightgreen; font-weight: bold; }
table { border-collapse: collapse; margin-bottom: 20px; }
th, td { border: 1px solid black; padding: 6px; }
</style>
</head>

<body>

<h1>School Report</h1>

<xsl:for-each select="student[generate-id() = generate-id(key('classKey', class)[1])]">

    <xsl:sort select="class" data-type="number"/>

    <xsl:variable name="cls" select="class"/>

    <h2>Class <xsl:value-of select="$cls"/></h2>

    
    <xsl:variable name="max">
        <xsl:for-each select="key('classKey', $cls)">
            <xsl:sort select="marks/math + marks/science + marks/english"
                      data-type="number" order="descending"/>
            <xsl:if test="position()=1">
                <xsl:value-of select="marks/math + marks/science + marks/english"/>
            </xsl:if>
        </xsl:for-each>
    </xsl:variable>

    <table>
        <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Total</th>
            <th>Grade</th>
        </tr>

        <!-- STUDENTS -->
        <xsl:for-each select="key('classKey', $cls)">
            <xsl:sort select="marks/math + marks/science + marks/english"
                      data-type="number" order="descending"/>

            <xsl:variable name="total"
                select="marks/math + marks/science + marks/english"/>

            <tr>
                <!-- Highlight top student -->
                <xsl:if test="$total = $max">
                    <xsl:attribute name="class">top</xsl:attribute>
                </xsl:if>

                <td><xsl:value-of select="position()"/></td>
                <td><xsl:value-of select="name"/></td>
                <td><xsl:value-of select="$total"/></td>

                <!-- Grade -->
                <td>
                    <xsl:call-template name="getGrade">
                        <xsl:with-param name="total" select="$total"/>
                    </xsl:call-template>
                </td>
            </tr>

        </xsl:for-each>
    </table>

    <!-- CLASS AVERAGE -->
    <xsl:variable name="sumTotal"
        select="
        sum(key('classKey', $cls)/marks/math) +
        sum(key('classKey', $cls)/marks/science) +
        sum(key('classKey', $cls)/marks/english)
        "/>

    <p>
        Average:
        <xsl:value-of select="format-number($sumTotal div count(key('classKey', $cls)), '0.00')"/>
    </p>

</xsl:for-each>

</body>
</html>
</xsl:template>

<xsl:template name="getGrade">
    <xsl:param name="total"/>

    <xsl:value-of select="
        /school/grades/grade[@min &lt;= $total]
        [not(@min &lt; ../grade[@min &lt;= $total]/@min)]
    "/>
</xsl:template>


</xsl:stylesheet>