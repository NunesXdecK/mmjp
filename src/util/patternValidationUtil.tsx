export const RG_MARK = "rg"
export const CEP_MARK = "nt"
export const CPF_MARK = "cpf"
export const NUMBER_MARK = "nmb"
export const NOT_NULL_MARK = "nt"
export const TEXT_NOT_NULL_MARK = "tnt"
export const TELEPHONE_MARK = "tlp"

export const ONLY_NUMBERS_PATTERN = "[^0-9]"
export const ONLY_NUMBERS_PATTERN_TWO = /\D/g


export const ONLY_CHARACTERS_PATTERN = "[A-Za-z]"
export const ONLY_CHARACTERS_PATTERN_TWO = /[0-9]/g
export const ONLY_WHITESPACES_PATTERN = /\A\s*\z/
export const ONLY_SPECIAL_PATTERN = /[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/
export const ONLY_SPECIAL_FOR_NUMBER_PATTERN = /[-_!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/

export const NOT_NULL_PATTERN = "[A-Za-z]{3}"
export const CPF_PATTERN= /(^\d{3}\.?\d{3}\.?\d{3}\-?\d{2}$)|(^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}\-?\d{2}$)/
export const CPF_PATTERN_TWO= "([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})"

export const STYLE_FOR_INPUT_LOADING = " animate-pulse bg-gray-300 "
