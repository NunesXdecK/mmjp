export const RG_MARK = "rg"
export const CEP_MARK = "nt"
export const CPF_MARK = "cpf"
export const DATE_MARK = "dt"
export const CCIR_MARK = "ccir"
export const CNPJ_MARK = "cnpj"
export const NUMBER_MARK = "nmb"
export const NOT_NULL_MARK = "nt"
export const TELEPHONE_MARK = "tlp"
export const TEXT_NOT_NULL_MARK = "tnt"
export const JSON_MARK = "json"

export const ONLY_NUMBERS_PATTERN = "[^0-9]"
export const ONLY_NUMBERS_PATTERN_TWO = /\D/g


export const ONLY_CHARACTERS_PATTERN = "[A-Za-z]"
export const ONLY_CHARACTERS_PATTERN_TWO = /[0-9]/g
export const ONLY_WHITESPACES_PATTERN = /\A\s*\z/
export const ONLY_SPECIAL_PATTERN = /[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/
export const ONLY_SPECIAL_FOR_NUMBER_PATTERN = /[-_!"`'#%&:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/

export const NOT_NULL_PATTERN = "[A-Za-z]{3}"
export const CNPJ_PATTERN = /(^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}\-?\d{2}$)/
export const CPF_PATTERN = /(^\d{3}\.?\d{3}\.?\d{3}\-?\d{2}$)|(^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}\-?\d{2}$)/
export const CCIR_PATTERN = /(^\d{3}\.?\d{3}\.?\d{3}\.?\d{3}\-?\d{1}$)/
export const DATE_PATTERN = /(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/
export const DATE_PATTERN_TWO = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
export const CPF_PATTERN_TWO = "([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})"

export const STYLE_FOR_INPUT_LOADING_TRANSPARENT = " animate-pulse "
export const STYLE_FOR_INPUT_LOADING = " animate-pulse bg-gray-300 "
